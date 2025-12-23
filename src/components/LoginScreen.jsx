import React, { useState } from 'react';
import { CONFIG } from '../config';
import styles from './LoginScreen.module.css';

const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === CONFIG.PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => {
        setError(false);
        setShake(false);
      }, 500);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.box}>
        <h1 className={styles.title}>Доля рынка</h1>
        <p className={styles.subtitle}>Введите пароль для доступа к дашборду</p>
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${styles.input} ${error ? styles.inputError : ''} ${shake ? styles.shake : ''}`}
          placeholder="••••"
          autoFocus
          maxLength={10}
        />
        
        <button type="submit" className={styles.button}>
          Войти
        </button>
        
        {error && (
          <div className={styles.errorText}>Неверный пароль</div>
        )}
      </form>
    </div>
  );
};

export default LoginScreen;
