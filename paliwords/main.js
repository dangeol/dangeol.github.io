"use strict";
var pw = pw || {};
pw.main = (function() {

  var replMap = { 'ā':'a', 'ī':'i', 'ṅ':'n', 'ṇ':'n', 'ñ':'n', 'ū':'u' };
  var replRegex = new RegExp('[' + Object.keys(replMap).join('') + ']', 'ig');
  var ped = dataPed[0].words;
  var cped = dataCped[0].words;
  var englWords = listEnglWords;
  var englWordsLength = listEnglWords.length;
  var translDiv = document.createElement("DIV");
  var translPedWord = document.createElement("SPAN");
  var translPedDescr = document.createElement("SPAN");
  var translCpedWord = document.createElement("SPAN");
  var translCpedDescr = document.createElement("SPAN");
  var newLine = document.createElement("SPAN");
  var translNotFound = document.createElement("SPAN");
  const input = document.getElementById('userFile');
  const reader = new FileReader();

  input.onchange = function() {
    const file = input.files[0];
    var fileExt = getFilename().split('.').pop();
    if (fileExt.localeCompare("txt") !== 0 && 
        fileExt.substring(0,3).localeCompare("htm") !== 0 && 
        file.type !== "text/html") {
      document.getElementById("text").innerHTML = 
      "The file must be of type text/plain or text/html. Please try with another file.";
      return;
    }
    reader.onload = function(event) {
      var text = event.target.result;
      document.getElementById("intro").className = 'hidden';
      document.getElementById("text").className += ' text';
      document.getElementById("text").innerHTML = text;
      document.getElementById("translation").className += ' translation';
      getPaliHitList();
    };
    reader.onerror = function() {
      document.getElementById("text").innerHTML = 
      "An error occured while reading the file. Please try with another file.";
      reader.abort();
    };
    reader.readAsText(file);
  };

  function getFilename() {
    var fullPath = document.getElementById("userFile").value;
    if (fullPath) {
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
      var filename = fullPath.substring(startIndex);
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
      }
    return filename;
    }
  }

  $("#text,#translation,#glossary").click(function() {
    var s = window.getSelection();
    s.modify('extend', 'backward', 'word');
    var b = s.toString();

    s.modify('extend', 'forward', 'word');
    var a = s.toString();
    s.modify('move', 'forward', 'character');
    findTranslation(b + a);
    // credits to
    // https://stackoverflow.com/users/762449/alphamale
    // https://stackoverflow.com/users/2226755/a-312
    // on https://stackoverflow.com/questions/8499865/get-a-word-by-single-click
  });

  function getPaliHitList() {
    var paliWords = [], prev = "", context = 1;
    var noOfWords = document.getElementById("sliderInput").value;
    if (reader.result === null) {
      alert("You must first select a file.");
      return;
    }  
    var text = reader.result;
    //Check if italic or bold formatted words with pāḷi characters are present
    if (text.match(/<[ib]>(.*[āīṅṇñū].*)<\/[ib]>/) === null) {
      document.getElementById("listOfWords").innerHTML = 
      "The pāḷi word list could not be generated, because certain formatting elements in the file are missing.";
      return;
    }
    text = text.match(/<[ib]>(.*?)<\/[ib]>/g);
    text = text.toString().toLowerCase();
    text = replacePattern(text, context);
    text = text.replace(/,\s+|\s+,|s,/g,',');
    const regex1 = /\s*,\s*|-|\s+/;
    var arrayOfWords = text.split(regex1);
    arrayOfWords.sort();
    for (var i = 0, l = arrayOfWords.length; i < l; i++) {
      if (arrayOfWords[i].length > 2 && arrayOfWords[i] !== prev) {
        paliWords.push({'word':arrayOfWords[i], 'hits':1});
      } else if (arrayOfWords[i].length > 2 && prev !== "") {
        paliWords[paliWords.length-1].hits = paliWords[paliWords.length-1].hits + 1;
      }
      prev = arrayOfWords[i];
    };
    if (paliWords.length === 0) {
      document.getElementById("listOfWords").innerHTML = 
      "No pāḷi words were found.";
      return;
    }
    paliWords = shortenWordList(paliWords, noOfWords);
    buildWordList(paliWords, noOfWords);
  };

  function shortenWordList(paliWords, noOfWords) {
    paliWords.sort((a, b) => b.hits - a.hits);
    paliWords.splice(noOfWords, paliWords.length - noOfWords);
    paliWords.sort((a, b) => a.word.localeCompare(b.word));
    return paliWords;
  }

  function buildWordList(paliWords, noOfWords) {
    var li, listWord, listHits;
    var hitsHeader = document.createElement("SPAN");
    var fragment = document.createDocumentFragment();
    document.getElementById("listOfWords").innerHTML = "";
    hitsHeader.innerText = "The top " + noOfWords + " pāḷi words";
    hitsHeader.className += ' hitsHeader';
    fragment.appendChild(hitsHeader);
    paliWords.forEach(el => {
      li = document.createElement("li");
      listWord = document.createElement("SPAN");
      listWord.innerText = el.word;
      listWord.className += ' listWord';
      listHits = document.createElement("SPAN");
      listHits.innerText = ' (' + el.hits + ')';
      listHits.className += ' listHits';
      li.appendChild(listWord);
      li.appendChild(listHits);
      fragment.appendChild(li);
    }); 
    document.getElementById("listOfWords").appendChild(fragment);
  };  

  function findTranslation(paliWord) {
    var paliWordTemp, context = 2;
    document.getElementById("translation").innerHTML = "";
    paliWord = paliWord.toLowerCase();
    paliWord = replacePattern(paliWord, context);
    if (checkIfEnglish(paliWord)) {
      document.getElementById("translation").innerHTML = "(not a pāḷi word or no translation was found.)";
      return;
    }
    paliWordTemp = paliWord.replace(replRegex, replSpecialChars);
    firstPassSearch(paliWord, paliWordTemp, context); 
  }; 

  function replacePattern(text, context) {
    //context 1: Pali hit list, 2: translation
    switch (context) {
      case 1:
        text = text.replace(/\s+|<.+?>|<\/.+?>|[;.:"'\(\)]|[0-9]|&#|&nbsp/g,'');
        text = text.replace(/(ic|ically)(?=,|\s+)/g,'a');
        break;
      case 2:
        text = text.replace(/\s+|<.+?>|<\/.+?>|[;.:"'\(\)]|[0-9]|&#|&nbsp/g,'');
        text = text.replace(/s$/g,'');
        text = text.replace(/(ic|ically)$/g,'a');
        break;
    }    
    return text;
  }

  function checkIfEnglish(word) {
    for(var i = 0; i < englWordsLength; i++) {
      if (word.localeCompare(englWords[i]) === 0) {
        return true;
      }
    }
    return false;
  }

  function firstPassSearch(paliWord, paliWordTemp, context) {
    //context 1: Pali hit list, 2: translation
    //first pass: search in the value for the key "word"
    var pedDescr = "", cpedDescr = "", pedWord, pedWordLength, pedWordSubstr1, advSearchResult, 
    matchedPedWord = "", matchedCpedWord = "", i, j = 0, r = 1, l = ped.length, match, iter, dict;
    context === 1 ? iter = 1 : iter = 2;
    for (i = 0; i < iter; i++) {
      j = 0; match = false;
      i === 0 ? dict = cped : dict = ped;
      while (j < l && !match) {
        pedWord = dict[j].word.toLowerCase().replace(replRegex, replSpecialChars);
        pedWordLength = pedWord.length;
        pedWordSubstr1 = pedWord.substring(0, pedWordLength-1);
        if (pedWord.localeCompare(paliWordTemp) === 0 
          || /[0-9]/.test(pedWord.substring(pedWordLength - 1, pedWordLength)) 
          && pedWordSubstr1.localeCompare(paliWordTemp) === 0) {
          if (i === 0) {
            matchedCpedWord = dict[j].word;
            cpedDescr = " --- " + dict[j].description;
          } else if (i === 1) {
            matchedPedWord = dict[j].word;
            pedDescr = dict[j].description;
          }
          match = true;
        }
        //additionally search in "description" that corresponds to the current "word"
        if (i > 0 && !match && (pedWord.substring(0, 3).localeCompare(paliWordTemp.substring(1, 4)) === 0)) { 
          advSearchResult = advancedSearch(dict[j], paliWord, paliWordTemp, 1);
          if (advSearchResult !== null) {
            matchedPedWord = firstCharToUpperCase(advSearchResult.word); 
            pedDescr = advSearchResult.descr; 
            match = true;    
          }
        }
        j++;
      }
      if (match) {
        buildTranslBlock(match, matchedCpedWord, cpedDescr, matchedPedWord, pedDescr);
      }
      else if (i > 0) {
        while (!match && r <= 3) {
          match = secondPassSearch(paliWord, paliWordTemp, matchedCpedWord, cpedDescr, r);
          r++;
        } 
      }   
    } 
    return match;
  }  

  function secondPassSearch(paliWord, paliWordTemp, matchedCpedWord, cpedDescr, run) {
    //second pass: in-depth search of the words that have not yet been found
    var pedDescr = "", advSearchResult, matchedPedWord = "", 
    j = 0, l = ped.length, match = false;
    while (j < l && !match) {
      advSearchResult = advancedSearch(ped[j], paliWord, paliWordTemp, run);
      if (advSearchResult !== null) {
        matchedPedWord = firstCharToUpperCase(advSearchResult.word);
        pedDescr = advSearchResult.descr; 
        match = true;    
      }
      j++;
    } 
    buildTranslBlock(match, matchedCpedWord, cpedDescr, matchedPedWord, pedDescr);
    return match;
  }  

  function advancedSearch(ped, paliWord, paliWordTemp, run) {
    //search for words in certain format patterns in the json value
    var advancedMatch;
    var pedDescrTemp = ped.description.replace(replRegex, replSpecialChars);
    var matchedPedWord, pedDescrPrep = "", result;
    switch (run) {
      case 1:
        advancedMatch = pedDescrTemp.toString().indexOf("**"+paliWordTemp+"**");
        if (advancedMatch !== -1) { 
          matchedPedWord = ped.description.substring(advancedMatch + 2, advancedMatch + 
            paliWordTemp.length + 2);
          pedDescrPrep = ped.description.substring(advancedMatch + 
          paliWordTemp.length + 4, ped.description.length);
        } 
        break;
      case 2:
        advancedMatch = pedDescrTemp.toString().indexOf(paliWordTemp+"˚");
        if (advancedMatch !== -1) { 
          matchedPedWord = paliWord + " \u2192 " +
            ped.description.substring(advancedMatch, advancedMatch + 
            paliWordTemp.length).concat(firstCharToLowerCase(ped.word));
          pedDescrPrep = ped.description;
        } 
        break;
      case 3:
        paliWordTemp = paliWordTemp.substring(0, paliWordTemp.length - 1); 
        advancedMatch = pedDescrTemp.toString().indexOf("˚"+paliWordTemp);
        if (advancedMatch !== -1) { 
          matchedPedWord = paliWord + " \u2192 " +  ped.word.concat(
            ped.description.substring(advancedMatch + 1, advancedMatch + 
            paliWordTemp.length + 2));
          pedDescrPrep = ped.description;
        } 
        break;  
    }  
    pedDescrPrep !== "" ? result = { "word": matchedPedWord, "descr": pedDescrPrep } : result = null;
    return result;
  }

  function buildTranslBlock(match, cpedWord, cpedDescr, pedWord, pedDescr) {
    translDiv.innerHTML = ""; translPedWord.innerHTML = ""; translCpedWord.innerHTML = "";
    translPedDescr.innerHTML = ""; translCpedDescr.innerHTML = ""; translNotFound.innerHTML = "";
    if (match) {
      translPedWord.innerText = pedWord;
      translPedWord.className += ' translPedWord';
      translDiv.appendChild(translPedWord);
      translCpedDescr.innerText = cpedDescr;
      translCpedDescr.className += ' translCpedDescr';
      translDiv.appendChild(translCpedDescr);  
      translPedDescr.innerText = pedDescr;
      translPedDescr.className += ' translPedDescr';
      newLine.innerHTML = "<br />";    
      translDiv.appendChild(newLine);
      translDiv.appendChild(translPedDescr);
    } else {
      translNotFound.innerText = "(not a pāḷi word or no translation was found.)";
      translDiv.appendChild(translNotFound);
    }  
    document.getElementById("translation").appendChild(translDiv); 
  }; 

  function replSpecialChars(input) {
    return replMap[input];
  }

  function firstCharToUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } 

  function firstCharToLowerCase(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
  } 

  return {
    updateHitList: function () {
      if (reader.result === null) {
        alert("You must first select a file.");
        return;
      }
      getPaliHitList();
    }
  };
})();
