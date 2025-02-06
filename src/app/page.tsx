'use client';

import React, { useState } from 'react';

import Chat from '@/components/chat/Chat';

const Home = () => {
  const [user, setUser] = useState<string | null>(null);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const user = event.currentTarget.value;
      setUser(user);
    }
  };

  const nameInputStyles = {
    background: 'transparent',
    color: '#999',
    border: 0,
    borderBottom: '1px solid #666',
    borderRadius: 0,
    fontSize: '3rem',
    fontWeight: 500,
    boxShadow: 'none !important',
  };

  return (
    <main className="container-fluid position-absolute h-100 bg-dark">
      <div className="row position-absolute w-100 h-100">
        <section className="col-md-8 d-flex align-items-center align-content-center flex-row flex-wrap px-5">
          <div className="mx-5 px-5">
            <span className="d-block w-100 h1 text-light" style={{ marginTop: -50 }}>
              {user ? (
                <span>
                  <span style={{ color: '#999' }}>Hello!</span> {user}
                </span>
              ) : (
                'What is your name?'
              )}
            </span>
            {!user && (
              <input
                type="text"
                className="form-control mt-3 px-3 py-2"
                onKeyUp={handleKeyUp}
                autoComplete="off"
                style={nameInputStyles}
              />
            )}
          </div>
        </section>
        <section className="col-md-4 position-relative d-flex h-100 align-items-start align-content-between flex-wrap bg-white px-0">
          {user && <Chat activeUser={user} />}
        </section>
      </div>
    </main>
  );
};

export default Home;
