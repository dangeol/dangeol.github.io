"use strict";
var replMap = { 'ā':'a', 'ī':'i', 'ṅ':'n', 'ṇ':'n', 'ñ':'n', 'ū':'u' };
var replRegex = new RegExp('[' + Object.keys(replMap).join('') + ']', 'ig');
var paliWords, hits, hitsSorted, pedDescr, prev, notFoundWords, matchedPedWord, noOfWords;

function replSpecialChars(input) {
  return replMap[input];
}

var ped = dataPed[0].words;
    
const input = document.getElementById('userFile');
const reader = new FileReader();

$("#text,#translation,#glossary").click(function() {
  var s = window.getSelection();
  s.modify('extend', 'backward', 'word');
  var b = s.toString();

  s.modify('extend', 'forward', 'word');
  var a = s.toString();
  s.modify('move', 'forward', 'character');
  getTranslation(b + a);
  // credits to
  // https://stackoverflow.com/users/762449/alphamale
  // https://stackoverflow.com/users/2226755/a-312
  // on https://stackoverflow.com/questions/8499865/get-a-word-by-single-click
});

input.onchange = function() {
  const file = input.files[0];
  reader.readAsText(file);
};

function getText() {
  if (reader.result === null) {
    alert("You must first select a file.");
    return;
  }
  var text = reader.result;
  document.getElementById("text").style.overflowY = "auto";
  document.getElementById("text").innerHTML = text;

  getPaliHitList();
}

function advancedSearch(ped, paliWordTemp) {
  var pedDescrTemp = ped.description.replace(replRegex, replSpecialChars);
  var advancedMatch = pedDescrTemp.toString().indexOf("**"+paliWordTemp+"**");
  if (advancedMatch !== -1) { 
    matchedPedWord = ped.word;
    var pedDescrPrep = ped.description.substring(advancedMatch + 
    paliWordTemp.length + 4, ped.description.length);
    return pedDescrPrep;
  }  
  return null;
}

function getPaliHitList() {
  if (reader.result === null) {
    alert("You must first select a file.");
    return;
  }
  document.getElementById("listOfWords").innerHTML = "";
  noOfWords = document.getElementById("sliderInput").value;
  var text = reader.result;
  var words = text.match(/<i>(.*?)<\/i>/g).toString().toLowerCase();
  words = words.replace(/\s+|<i>|<\/i>|[;.:]|\(|\)|&nbsp|<br>/g,'');
  words = words.replace(/,\s+|\s+,|s,/g,',');
  words = words.replace(/(ic|ically)(?=,|\s+)/g,'a');
  const regex1 = /\s*,\s*|-|\s+/;
  var arrayOfWords = words.split(regex1);
  paliWords = [], hits = [], hitsSorted = [], pedDescr = [], prev = "", notFoundWords = "", matchedPedWord = "";
  arrayOfWords.sort();
  for (var i = 0; i < arrayOfWords.length; i++) {
    if (arrayOfWords[i].substring(0,1).match(/[a-z]/) && arrayOfWords[i] !== prev) {
      paliWords.push(arrayOfWords[i]);
      hits.push(1); 
    } else {
      hits[hits.length-1]++;
    }
    prev = arrayOfWords[i];
  }
  hitsSorted = hits.slice();
  hitsSorted.sort(function(a, b){return b - a});
  var thresholdHits = hitsSorted[noOfWords - 1];

  var hitsHeader = document.createElement("SPAN");
  hitsHeader.innerText = "The top "+noOfWords+ " pāḷi words";
  hitsHeader.style.fontSize = "18px";
  hitsHeader.style.fontWeight = "bold";
  hitsHeader.style.color = "red";
  document.getElementById("listOfWords").appendChild(hitsHeader);

  paliWords.forEach(function(word, index) {
    if (hits[index] >= thresholdHits) {
      var li = document.createElement("li");
      var wordInput = document.createElement("SPAN");
      wordInput.innerText = word;
      wordInput.style.fontSize = "18px";
      wordInput.style.fontWeight = "bold";
      var hitsInput = document.createElement("SPAN");
      hitsInput.innerText = ' (' + hits[index] + ')';
      hitsInput.style.fontSize = "18px";
      hitsInput.style.fontStyle = "italic";
      hitsInput.style.color = "blue";
      li.appendChild(wordInput);
      li.appendChild(hitsInput);
      document.getElementById("listOfWords").appendChild(li);
    }
  }); 
};  

function getTranslation(paliWord) {
  document.getElementById("translation").style.display = "block";
  document.getElementById("translation").innerHTML = "";
  paliWord = paliWord.toLowerCase();
  paliWord = paliWord.replace(/(ic|ically)(?=,|\s+)/g,'a');
  paliWord = paliWord.replace(/[;.:]|\s+|\(|\)|&nbsp|<br>/g,'');
  matchedPedWord = "";
  var notFound = false;
  //first pass: search in the json keys and in matching values
  var j = 0;
  var match = false;
  var paliWordTemp = paliWord.replace(replRegex, replSpecialChars);
  while (j < ped.length && !match) {
    var pedWord = ped[j].word.toLowerCase().replace(replRegex, replSpecialChars);
    var pedWordSubstr1 = pedWord.substring(0, pedWord.length-1);
    if (pedWord.localeCompare(paliWordTemp) === 0 
      || /[0-9]/.test(pedWord.substring(pedWord.length - 1, pedWord.length)) 
      && pedWordSubstr1.localeCompare(paliWordTemp) === 0) {
      matchedPedWord = ped[j].word;
      pedDescr = ped[j].description;
      match = true;
    }
    if (!match && (pedWord.substring(0, 3).localeCompare(paliWordTemp.substring(1, 4)) === 0)) { 
      var advSearchResult = advancedSearch(ped[j], paliWordTemp);
      if (advSearchResult !== null) {
        pedDescr = advSearchResult; 
        match = true;    
      }
    }
    j++;
  } 
  if (!match) {
    notFound = true;
  }         
  //second pass: in-depth search of the words that have not yet been found
  if (notFound) {
    var j = 0;
    var match = false;
    var paliWordTemp = paliWord.replace(replRegex, replSpecialChars);
    while (j < ped.length && !match) {
      var advSearchResult = advancedSearch(ped[j], paliWordTemp);
      if (advSearchResult !== null) {
        pedDescr = advSearchResult; 
        match = true;    
      }
      j++;
    } 
  }
  var translDiv = document.createElement("DIV");
  if (match) {
    var wordInput = document.createElement("SPAN");
    wordInput.innerText = paliWord;
    wordInput.style.fontSize = "18px";
    wordInput.style.fontWeight = "bold";
    var pedDescrInput = document.createElement("SPAN");
    pedDescrInput.innerText = pedDescr;
    var newLine = document.createElement("SPAN");
    newLine.innerHTML = "<br />";
    translDiv.appendChild(wordInput);
    translDiv.appendChild(newLine);
    translDiv.appendChild(pedDescrInput);
  } else {
    var notFoundInput = document.createElement("SPAN");
    notFoundInput.innerText = "No translation was found.";
    notFoundInput.style.fontSize = "18px";
    notFoundInput.style.fontWeight = "bold";
    translDiv.appendChild(notFoundInput);
  }  
  document.getElementById("translation").appendChild(translDiv); 
};  
