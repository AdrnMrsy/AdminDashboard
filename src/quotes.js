const quotes = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "Stay hungry, stay foolish. - Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "The only thing we have to fear is fear itself. - Franklin D. Roosevelt",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Act as if what you do makes a difference. It does. - William James",
  "Success is not how high you have climbed, but how you make a positive difference to the world. - Roy T. Bennett",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
  "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
  "Opportunities don't happen. You create them. - Chris Grosser",
  "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart. - Roy T. Bennett",
  "It always seems impossible until it's done. - Nelson Mandela",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "The successful warrior is the average man, with laser-like focus. - Bruce Lee",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "Whether you think you can or you think you can’t, you’re right. - Henry Ford",
  "I never dreamed about success. I worked for it. - Estée Lauder",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Do not wait to strike till the iron is hot, but make it hot by striking. - William Butler Yeats",
  "I attribute my success to this: I never gave or took any excuse. - Florence Nightingale",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "Success is not in what you have, but who you are. - Bo Bennett",
  "Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou",
  "The secret of success is to do the common thing uncommonly well. - John D. Rockefeller Jr.",
  "I failed my way to success. - Thomas Edison",
  "It does not matter how slowly you go, so long as you do not stop. - Confucius",
  "The best revenge is massive success. - Frank Sinatra",
  "The harder the battle, the sweeter the victory. - Les Brown",
  "Don't be afraid to give up the good to go for the great. - Kenny Rogers",
  "The key to success is to focus on goals, not obstacles. - Unknown",
  "Success is the sum of small efforts, repeated day-in and day-out. - Robert Collier",
  "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
  "Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman",
  "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. - Christian D. Larson",
  "The best way to predict your future is to create it. - Peter Drucker",
  "Do not wait for leaders; do it alone, person to person. - Mother Teresa",
  "A goal is a dream with a deadline. - Napoleon Hill",
  "The only thing standing between you and your goal is the story you keep telling yourself as to why you can’t achieve it. - Jordan Belfort",
  "Success is not how far you got, but the distance you traveled from where you started. - Steve Prefontaine",
  "The difference between who you are and who you want to be is what you do. - Unknown",
  "To be successful, you must accept all challenges that come your way. You can't just accept the ones you like. - Mike Gafka",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
  "Success is getting what you want, happiness is wanting what you get. - W. P. Kinsella",
  "You don’t have to be great to start, but you have to start to be great. - Zig Ziglar",
  "Challenges are what make life interesting and overcoming them is what makes life meaningful. - Joshua J. Marine",
  "Don’t let yesterday take up too much of today. - Will Rogers",
  "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
  "The future belongs to those who prepare for it today. - Malcolm X",
  "If you can dream it, you can achieve it. - Zig Ziglar",
  "The biggest adventure you can take is to live the life of your dreams. - Oprah Winfrey",
  "The road to success and the road to failure are almost exactly the same. - Colin R. Davis",
  "Don’t let the fear of losing be greater than the excitement of winning. - Robert Kiyosaki",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "The only place success comes before work is in the dictionary. - Vince Lombardi",
  "The successful man will profit from his mistakes and try again in a different way. - Dale Carnegie",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
  "I find that the harder I work, the more luck I seem to have. - Thomas Jefferson",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
  "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful. - Albert Schweitzer",
  "Success is not how high you have climbed, but how you make a positive difference to the world. - Roy T. Bennett",
  "Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou",
  "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "Opportunities don't happen. You create them. - Chris Grosser",
  "Don't be afraid to give up the good to go for the great. - Kenny Rogers",
  "The best revenge is massive success. - Frank Sinatra",
  "Success is the sum of small efforts, repeated day in and day out. - Robert Collier",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Success is how high you bounce when you hit bottom. - George S. Patton",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "The successful warrior is the average man, with laser-like focus. - Bruce Lee",
  "Don't let the fear of losing be greater than the excitement of winning. - Robert Kiyosaki",
  "Success is not in what you have, but who you are. - Bo Bennett",
  "Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou",
  "Don't let the noise of others' opinions drown out your own inner voice. - Steve Jobs",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh",
  "Success is walking from failure to failure with no loss of enthusiasm. - Winston Churchill",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "Don't be afraid to give up the good to go for the great. - John D. Rockefeller",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. - Christian D. Larson",
  "Success is not in what you have, but who you are. - Bo Bennett",
  "Don't let the fear of losing be greater than the excitement of winning. - Robert Kiyosaki",
  "Opportunities don't happen. You create them. - Chris Grosser",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
  "Don't be afraid to give up the good to go for the great. - Kenny Rogers",
  "Success is the sum of small efforts, repeated day-in and day-out. - Robert Collier",
  "The only place where success comes before work is in the dictionary. - Vidal Sassoon",
  "Keep your face always toward the sunshine—and shadows will fall behind you. - Walt Whitman",
  "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
  "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The best way to predict your future is to create it. - Peter Drucker",
  "Do not wait for leaders; do it alone, person to person. - Mother Teresa",
  "A goal is a dream with a deadline. - Napoleon Hill",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "Success is not how high you have climbed, but how you make a positive difference to the world. - Roy T. Bennett",
  "Don't be afraid to give up the good to go for the great. - Kenny Rogers",
  "Success is liking yourself, liking what you do, and liking how you do it. - Maya Angelou",
  "The best revenge is massive success. - Frank Sinatra",
  "The successful warrior is the average man, with laser-like focus. - Bruce Lee",
  "Success is not in what you have, but who you are. - Bo Bennett",
  "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
  "Don't let the fear of losing be greater than the excitement of winning. - Robert Kiyosaki"
];

export default quotes;
