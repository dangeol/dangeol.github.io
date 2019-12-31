"use strict";
var pw = pw || {};
pw.main = (function() {

  var replMap = { 'ā':'a', 'ī':'i', 'ṅ':'n', 'ṇ':'n', 'ñ':'n', 'ū':'u' };
  var replRegex = new RegExp('[' + Object.keys(replMap).join('') + ']', 'ig');
  var ped = dataPed[0].words;
  var translDiv = document.createElement("DIV");
  var translWord = document.createElement("SPAN");
  var translPedDescr = document.createElement("SPAN");
  var newLine = document.createElement("SPAN");
  var translNotFound = document.createElement("SPAN");
  const input = document.getElementById('userFile');
  const reader = new FileReader();

  input.onchange = function() {
    const file = input.files[0];
    if (file.type !== "text/html") {
      document.getElementById("text").innerHTML = 
      "The file must be of type text/html. Please try with another file.";
      return;
    }
    reader.onload = function(event) {
      var text = event.target.result;
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
    var paliWords = [], prev = "";
    var noOfWords = document.getElementById("sliderInput").value;
    if (reader.result === null) {
      alert("You must first select a file.");
      return;
    }  
    var text = reader.result;
    //Only match italic formatted words 
    text = text.match(/<i>(.*?)<\/i>/g);
    if (text === null) {
      document.getElementById("listOfWords").innerHTML = 
      "No pāḷi words were found. Currently, only italic words in a html are taken into account.";
      return;
    }
    text = text.toString().toLowerCase();
    text = replacePattern(text);
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
    }
    ;
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
    hitsHeader.innerText = "The top "+noOfWords+ " pāḷi words";
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
    var paliWordTemp, found = false;
    document.getElementById("translation").innerHTML = "";
    paliWord = paliWord.toLowerCase();
    paliWord = replacePattern(paliWord);
    paliWordTemp = paliWord.replace(replRegex, replSpecialChars);
    found = firstPassSearch(paliWord, paliWordTemp);
    if (!found) {
      found = secondPassSearch(paliWord, paliWordTemp);
    }  
    return found;
  }; 

  function replacePattern(text) {
    text = text.replace(/\s+|<.+?>|<\/.+?>|[;.:"'\(\)]|[0-9]|&#|&nbsp/g,'');
    text = text.replace(/(ic|ically)(?=,|\s+)/g,'a');
    return text;
  }

  function firstPassSearch(paliWord, paliWordTemp) {
    //first pass: search in the json keys and in matching values  
    var pedDescr = "", pedWord, pedWordLength, pedWordSubstr1, advSearchResult, 
    matchedPedWord = "", j = 0, l = ped.length, match = false;
    while (j < l && !match) {
      pedWord = ped[j].word.toLowerCase().replace(replRegex, replSpecialChars);
      pedWordLength = pedWord.length;
      pedWordSubstr1 = pedWord.substring(0, pedWordLength-1);
      if (pedWord.localeCompare(paliWordTemp) === 0 
        || /[0-9]/.test(pedWord.substring(pedWordLength - 1, pedWordLength)) 
        && pedWordSubstr1.localeCompare(paliWordTemp) === 0) {
        matchedPedWord = ped[j].word;
        pedDescr = ped[j].description;
        match = true;
        buildTranslBlock(match, paliWord, pedDescr);
      }
      if (!match && (pedWord.substring(0, 3).localeCompare(paliWordTemp.substring(1, 4)) === 0)) { 
        advSearchResult = advancedSearch(ped[j], paliWordTemp);
        if (advSearchResult !== null) {
          pedDescr = advSearchResult; 
          match = true;    
          buildTranslBlock(match, paliWord, pedDescr);
        }
      }
      j++;
    } 
    return match;
  }  

  function secondPassSearch(paliWord, paliWordTemp) {
    //second pass: in-depth search of the words that have not yet been found
    var pedDescr = "", advSearchResult, matchedPedWord = "", 
    j = 0, l = ped.length, match = false;
    while (j < l && !match) {
      advSearchResult = advancedSearch(ped[j], paliWordTemp);
      if (advSearchResult !== null) {
        pedDescr = advSearchResult; 
        match = true;    
      }
      j++;
    } 
    buildTranslBlock(match, paliWord, pedDescr);
    return match;
  }  

  function advancedSearch(ped, paliWordTemp) {
    //search for words in certain format patterns in the json value
    var pedDescrTemp = ped.description.replace(replRegex, replSpecialChars);
    var advancedMatch = pedDescrTemp.toString().indexOf("**"+paliWordTemp+"**");
    var matchedPedWord, pedDescrPrep;
    if (advancedMatch !== -1) { 
      matchedPedWord = ped.word;
      pedDescrPrep = ped.description.substring(advancedMatch + 
      paliWordTemp.length + 4, ped.description.length);
      return pedDescrPrep;
    }  
    return null;
  }

  function buildTranslBlock(match, paliWord, pedDescr) {
    translDiv.innerHTML = ""; translWord.innerHTML = ""; 
    translPedDescr.innerHTML = ""; translNotFound.innerHTML = "";
    if (match) {
      translWord.innerText = paliWord;
      translWord.className += ' translWord';
      translPedDescr.innerText = pedDescr;
      translPedDescr.className += ' translPedDescr';
      newLine.innerHTML = "<br />";
      translDiv.appendChild(translWord);
      translDiv.appendChild(newLine);
      translDiv.appendChild(translPedDescr);
    } else {
      translNotFound.innerText = "No translation was found.";
      translNotFound.className += ' translNotFound';
      translDiv.appendChild(translNotFound);
    }  
    document.getElementById("translation").appendChild(translDiv); 
  }; 

    function replSpecialChars(input) {
    return replMap[input];
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
