import { useState } from 'react';
import styles from '@/styles/BaseUrlSettings.module.css';

type BaseUrlSettingsProps = {
  baseUrl: string;
  onBaseUrlChange: (newBaseUrl: string) => void;
};

export default function BaseUrlSettings({ baseUrl, onBaseUrlChange }: BaseUrlSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempBaseUrl, setTempBaseUrl] = useState(baseUrl);

  const handleSave = () => {
    onBaseUrlChange(tempBaseUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempBaseUrl(baseUrl);
    setIsEditing(false);
  };

  const handleReset = () => {
    const defaultUrl = 'http://localhost:3000/dev';
    setTempBaseUrl(defaultUrl);
    onBaseUrlChange(defaultUrl);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <h3>API Base URL Settings</h3>
      
      {!isEditing ? (
        <div className={styles.displayMode}>
          <div className={styles.currentUrl}>
            <strong>Current Base URL:</strong>
            <code>{baseUrl}</code>
          </div>
          <div className={styles.buttons}>
            <button 
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
            >
              Edit
            </button>
            <button 
              onClick={handleReset}
              className={styles.resetButton}
            >
              Reset to Default
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.editMode}>
          <div className={styles.inputGroup}>
            <label htmlFor="baseUrl">Base URL:</label>
            <input
              id="baseUrl"
              type="text"
              value={tempBaseUrl}
              onChange={(e) => setTempBaseUrl(e.target.value)}
              placeholder="http://localhost:3000/dev"
              className={styles.input}
            />
          </div>
          <div className={styles.buttons}>
            <button 
              onClick={handleSave}
              className={styles.saveButton}
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className={styles.presets}>
        <h4>Quick Presets:</h4>
        <div className={styles.presetButtons}>
          <button 
            onClick={() => onBaseUrlChange('http://localhost:3000/dev')}
            className={styles.presetButton}
          >
            Local Dev
          </button>
          <button 
            onClick={() => onBaseUrlChange('https://your-api-gateway.execute-api.region.amazonaws.com/dev')}
            className={styles.presetButton}
          >
            AWS Dev
          </button>
          <button 
            onClick={() => onBaseUrlChange('https://your-api-gateway.execute-api.region.amazonaws.com/prod')}
            className={styles.presetButton}
          >
            AWS Prod
          </button>
        </div>
      </div>
    </div>
  );
}