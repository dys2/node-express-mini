const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');

const STATUS_USER_ERROR = 422;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());

/* Returns a list of dictionary words from the words.txt file. */
const readWords = () => {
  const contents = fs.readFileSync('words.txt', 'utf8');
  return contents.split('\n');
};

const words = readWords();
const random = Math.floor(Math.random() * 235836);
const word = words[random];
let array = word.split('').map(v => '-');
const guesses = [];

server.post('/guess', (req, res) => {
  const letter = req.body.letter;
  if (!letter) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: "must provide letter" });
    return
  }
  if (guesses.includes(letter)) {
    res.status(STATUS_USER_ERROR);
    res.json({ error: "this letter has already been guessed" });
    return
  } else {
    guesses.push(letter);
  }
  word.split('').forEach((l, i) => {
    if (l === letter) array[i] = letter;
  });
  if (array.join('') === word) res.json({"Congrats your guessed ": word})    
  res.json({ "Keep trying": array.join('') });
});

server.get('/guess', (req, res) => {
    res.json({ "wordSoFar": array.join(''), "guesses": guesses});
});



server.listen(3000);
