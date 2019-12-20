var replMap = { 'ā':'a', 'ī':'i', 'ṅ':'n', 'ṇ':'n', 'ñ':'n', 'ū':'u' };
var replRegex = new RegExp('[' + Object.keys(replMap).join('') + ']', 'ig');

function replSpecialChars(input) {
  return replMap[input];
}

var ped = data[0].words;
    
const input = document.getElementById('userFile');
const reader = new FileReader();

input.onchange = function() {
  const file = input.files[0];
  reader.readAsText(file);
};

function advancedSearch(ped, paliWordTemp) {
  var pedDescrTemp = ped.description.replace(replRegex, replSpecialChars);
  var advancedMatch = pedDescrTemp.toString().indexOf("**"+paliWordTemp+"**");
  if (advancedMatch !== -1) { 
    pedDescrPrep = ped.description.substring(advancedMatch + 
    paliWordTemp.length + 4, ped.description.length);
    return pedDescrPrep;
  }  
  return null;
}

function generateSheet() {
  if (reader.result === null) {
    alert("You must first select a file.");
    return;
  }
  document.getElementById("listOfWords").innerHTML = "";
  const noOfWords = document.getElementById("sliderInput").value;
  var text = reader.result;
  var words = text.match(/((?<=<i>))(.*?)(?=<\/i>)/g).toString().toLowerCase();
  words = words.replace(/[;.:]/g,'');
  words = words.replace(/(?<=,)\s+/g,'');
  words = words.replace(/\(|\)|&nbsp|<br>/g,'');
  words = words.replace(/ic(?=,|\s+)/g,'a');
  words = words.replace(/s(?=,|\s+)/g,'');
  words = words.replace(/\s+(?=,)/g,'');
  const regex1 = /\s*,\s*|\s+/;
  var arrayOfWords = words.split(regex1);
  var paliWords = [], hits = [], hitsSorted = [], pedDescr = [], prev, notFound = "";
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
  //first pass: search in the json keys and in matching values
  for (var i = 0; i < paliWords.length; i++) {
    if (hits[i] >= thresholdHits) {
      var j = 0;
      var match = false;
      pedDescr[i] = "(No translation was found.)";
      var paliWordTemp = paliWords[i].toLowerCase().replace(replRegex, replSpecialChars);
      while (j < ped.length && !match) {
        var pedWord = ped[j].word.toLowerCase().replace(replRegex, replSpecialChars);
        var pedWordSubstr1 = pedWord.substring(0, pedWord.length-1);
        if (pedWord.localeCompare(paliWordTemp) === 0 || pedWordSubstr1.localeCompare(paliWordTemp) === 0) {
          pedDescr[i] = ped[j].description;
          match = true;
        }
        if (!match && (pedWord.substring(0, 3).localeCompare(paliWordTemp.substring(1, 4)) === 0)) { 
          var advSearchResult = advancedSearch(ped[j], paliWordTemp);
          if (advSearchResult !== null) {
            pedDescr[i] = advSearchResult.substring(0, pedDescrPrep.indexOf("**")); 
            match = true;    
          }
        }
        j++;
      } 
    } if (!match) {
      notFound = notFound.concat(paliWordTemp+",");
    }         
  }   
  //second pass: in-depth search of the words that have not yet been found
  for (var i = 0; i < paliWords.length; i++) {
    if (notFound.indexOf(","+paliWords[i].toLowerCase().replace(replRegex, replSpecialChars)+",") !== -1) {
      var j = 0;
      var match = false;
      var paliWordTemp = paliWords[i].toLowerCase().replace(replRegex, replSpecialChars);
      while (j < ped.length && !match) {
        var advSearchResult = advancedSearch(ped[j], paliWordTemp);
        if (advSearchResult !== null) {
          pedDescr[i] = advSearchResult.substring(0, pedDescrPrep.indexOf("**")); 
          match = true;    
        }
        j++;
      } 
    }
  }        
  paliWords.forEach(function(word, index) {
    if (hits[index] >= thresholdHits) {
      var li = document.createElement("li");
      var wordInput = document.createElement("SPAN");
      wordInput.innerText = word;
      wordInput.style.fontSize = "18px";
      wordInput.style.fontWeight = "bold";
      var hitsInput = document.createElement("SPAN");
      hitsInput.innerText = ' (' + hits[index] + ') : ';
      hitsInput.style.fontSize = "18px";
      hitsInput.style.fontStyle = "italic";
      hitsInput.style.color = "blue";
      var pedDescrInput = document.createElement("SPAN");
      pedDescrInput.innerText = pedDescr[index].substring(0,180) + " [...]";
      var buttonInput = document.createElement("INPUT");
      var expanded = false;
      buttonInput.type = "button";
      buttonInput.value = "expand / collapse";
      buttonInput.onclick = function() {
        if (!expanded) {
          pedDescrInput.innerText = pedDescr[index];
          expanded = true;
        } else {
          pedDescrInput.innerText = pedDescr[index].substring(0,180) + " [...]";
          expanded = false;
        }
      }
      var newLine = document.createElement("SPAN");
      newLine.innerHTML = "<br />";
      li.appendChild(wordInput);
      li.appendChild(hitsInput);
      li.appendChild(buttonInput);
      li.appendChild(newLine);
      li.appendChild(pedDescrInput);
      document.getElementById("listOfWords").appendChild(li);
    }
  }); 
};