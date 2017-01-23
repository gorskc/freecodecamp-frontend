$(document).ready(function(){

  var randNum;
  var randQuote;
  var randAuthor;
  getColor();
  getQuote();

  function getQuote() {
    var quotes = [
"Believe in yourself! Have faith in your abilities! Without a humble but reasonable confidence in your own powers you cannot be successful or happy.",
"A jury consists of twelve persons chosen to decide who has the better lawyer.",
"Frankly, I’m suspicious of anyone who has a strong opinion on a complicated issue.",
"A doctor saves lives -- It's up to people to create lives that are worth saving.",
"To me, old age is always 15 years older than I am.",
"Beware of the man who won't be bothered with details.",
"It hurts to find out that what you wanted doesn't match what you dreamed it would be.",
"The direct use of force is such a poor solution to any problem, it is generally employed only by small children and large nations.",
"The more I give myself permission to live in the moment and enjoy it without feeling guilty or judgmental about any other time, the better I feel about the quality of my work.",
"Poets have been mysteriously silent on the subject of cheese.",
"Being a celebrity has taught me to hide, but being an actor has opened my soul.",
"Every time you spend money, you're casting a vote for the kind of world you want.",
"Work is not always required... there is such a thing as sacred idleness, the cultivation of which is now fearfully neglected.",
"Mothers may still want their sons to grow up to be President, but according to a famous Gallup poll of some years ago, some 73 percent do not want them to become politicians in the process.",
"Love is the delightful interval between meeting a beautiful girl and discovering that she looks like a haddock."];

  var author = ["Norman Vincent", "Robert Frost", "Scott Adams", "Philip Gold", "Bernard M. Baruch", "William Feather", "Randy K. Milholland", "David Friedman", "Wayne Dyer", "G.K. Chesterton", "Meryl Streep", "Anna Lappe", "George McDonald", "John F. Kennedy", "John Barrymore"];
  randNum = Math.floor(Math.random() * quotes.length);
  randQuote = quotes[randNum];
  randAuthor = "-" + author[randNum];

  $(".blockquote").text(randQuote);
  $("#quote-auth").text(randAuthor);
  }

  function getColor(){
    var colors = ["#544596", "#0d0d0d", "#ee0000", "#ffc125", "#69db84", "#5ea1d4", "#a61532", "#cf0038", "#6a0027", "#6dc066", "#fb9f96", "#006947", "#75250a", "#1d104a"];
    var randNum = Math.floor(Math.random()*colors.length);
    var randColor = colors[randNum];

    $(".color-style").css("background-color", randColor);
  }

  $(".btn").on("click", function(){
    getQuote();
    getColor();
  });

  $("#twitter").on("click", function(){
    window.open("https://twitter.com/intent/tweet?text=" + randQuote + randAuthor);
  });
});
