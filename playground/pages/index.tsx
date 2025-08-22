import { useState } from 'react';
import ApiTester from '@/components/api-tester';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Serverless API Playground
        </h1>

        <p className={styles.description}>
          Test your Serverless Framework REST API endpoints
        </p>

        <div className={styles.grid}>
          <ApiTester />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Powered by Serverless Framework & Next.js
        </p>
      </footer>
    </div>
  );
}