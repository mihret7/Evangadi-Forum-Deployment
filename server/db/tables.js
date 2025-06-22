const create_registration = `
  CREATE TABLE IF NOT EXISTS registration (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(254) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    password VARCHAR(100) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255)
  );
`;

const create_profile = `
  CREATE TABLE IF NOT EXISTS profile (
    user_profile_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
  );
`;

const create_question = `
  CREATE TABLE IF NOT EXISTS question (
    question_id SERIAL PRIMARY KEY,
    question_title VARCHAR(100) NOT NULL,
    question_description TEXT,
    tag VARCHAR(20),
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
  );
`;

const create_answer = `
  CREATE TABLE IF NOT EXISTS answer (
    answer_id SERIAL PRIMARY KEY,
    answer TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE
  );
`;

const create_likes_dislikes = `
  CREATE TABLE IF NOT EXISTS likes_dislikes (
    like_dislike_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    question_id INTEGER,
    answer_id INTEGER,
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (answer_id) REFERENCES answer(answer_id) ON DELETE CASCADE,
    CONSTRAINT unique_user_question_vote UNIQUE (user_id, question_id),
    CONSTRAINT unique_user_answer_vote UNIQUE (user_id, answer_id),
    CONSTRAINT check_single_target CHECK (
      (question_id IS NOT NULL AND answer_id IS NULL) OR 
      (question_id IS NULL AND answer_id IS NOT NULL)
    )
  );
`;

const create_password_reset_tokens = `
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES registration(user_id) ON DELETE CASCADE
  );
`;

const create_password_reset_token_index = `
  CREATE INDEX IF NOT EXISTS idx_token ON password_reset_tokens(token);
`;

module.exports = {
  create_registration,
  create_profile,
  create_question,
  create_answer,
  create_likes_dislikes,
  create_password_reset_tokens,
  create_password_reset_token_index,
};
