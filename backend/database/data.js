const createTableQueries = {
  users: `
      CREATE TABLE IF NOT EXISTS users (
        user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(60) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        phone_number VARCHAR(10) UNIQUE,
        payment_reference VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `,
  friends: `
      CREATE TABLE IF NOT EXISTS friends (
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        friend_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
        status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'blocked')),
        PRIMARY KEY (user_id, friend_id)
      );
    `,
  hisabs: `
      CREATE TABLE IF NOT EXISTS hisabs (
        hisab_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_by UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
        title VARCHAR(255) NOT NULL,
        total_budget DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `,
  hisab_contributors: `
      CREATE TABLE IF NOT EXISTS hisab_contributors (
        hisab_id UUID REFERENCES hisabs(hisab_id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        budget_contribution DECIMAL(10, 2),
        PRIMARY KEY (hisab_id, user_id)
      );
    `,
  transactions: `
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        hisab_id UUID REFERENCES hisabs(hisab_id) ON DELETE CASCADE,
        paid_by UUID REFERENCES users(user_id) ON DELETE CASCADE,
        amount DECIMAL(10, 2),
        description TEXT,
        date TIMESTAMP DEFAULT NOW()
      );
    `,
  transaction_contributors: `
      CREATE TABLE IF NOT EXISTS transaction_contributors (
        transaction_id UUID REFERENCES transactions(transaction_id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
        contributed_amount DECIMAL(10, 2),
        mode_of_payment VARCHAR(50) CHECK (mode_of_payment IN ('Cash', 'Cheque', 'Card', 'Online', 'Other')),
        PRIMARY KEY (transaction_id, user_id)
      );
    `,
  generated_summaries: `
      CREATE TABLE IF NOT EXISTS generated_summaries (
        summary_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        hisab_id UUID REFERENCES hisabs(hisab_id) ON DELETE CASCADE,
        generated_at TIMESTAMP DEFAULT NOW(),
        pdf_url VARCHAR(255),
        qr_code_link VARCHAR(255)
      );
    `,
  notifications: `
      CREATE TABLE IF NOT EXISTS notifications(
        notification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        is_read BOOLEAN DEFAULT FALSE,
        user_id UUID REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) CHECK(type IN ('FRIEND','HISAB_REQUEST', 'OTHER')),
        title TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `,
};

export default createTableQueries;
