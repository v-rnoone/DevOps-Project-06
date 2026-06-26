-- Schema for the quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL
);

-- Seed data so the app has something to fetch immediately
INSERT INTO quotes (text, author) VALUES
('The only way to do great work is to love what you do.', 'Steve Jobs'),
('Life is what happens when you are busy making other plans.', 'John Lennon'),
('The future belongs to those who believe in the beauty of their dreams.', 'Eleanor Roosevelt'),
('It does not matter how slowly you go as long as you do not stop.', 'Confucius'),
('Whether you think you can or you think you cannot, you are right.', 'Henry Ford'),
('The journey of a thousand miles begins with one step.', 'Lao Tzu'),
('Success is not final, failure is not fatal: it is the courage to continue that counts.', 'Winston Churchill'),
('In the middle of difficulty lies opportunity.', 'Albert Einstein'),
('You miss 100% of the shots you do not take.', 'Wayne Gretzky'),
('The best time to plant a tree was 20 years ago. The second best time is now.', 'Chinese Proverb');
