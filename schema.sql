-- ============================================
-- SchoolEventDays Database Schema
-- ============================================
-- Sistema di gestione eventi su due giorni
-- con registrazione sessioni orarie e verifica email OTP
-- Versione: 1.0
-- Ultimo aggiornamento: 01 Marzo 2026
-- ============================================

-- Impostazioni iniziali
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

-- ============================================
-- CREAZIONE DATABASE
-- ============================================
CREATE DATABASE IF NOT EXISTS `SchoolEventDays` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `SchoolEventDays`;

-- ============================================
-- TABELLA: corso
-- ============================================
-- Memorizza i corsi/eventi creati dagli organizzatori
-- Supporta eventi multi-ora (1, 2, 4, 5 ore) su 2 giorni
-- ============================================

CREATE TABLE `corso` (
  `codice_corso` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL COMMENT 'Nome del corso',
  `descrizione` VARCHAR(200) DEFAULT NULL COMMENT 'Descrizione dettagliata',
  `nome_cognome_classe_ref1` VARCHAR(80) DEFAULT NULL COMMENT 'Primo referente interno',
  `nome_cognome_classe_ref2` VARCHAR(80) DEFAULT NULL COMMENT 'Secondo referente interno',
  `nome_cognome_classe_ref3` VARCHAR(80) DEFAULT NULL COMMENT 'Terzo referente interno',
  `nome_cognome_classe_ref4` VARCHAR(80) DEFAULT NULL COMMENT 'Quarto referente interno',
  `nome_ref_esterni` VARCHAR(120) DEFAULT NULL COMMENT 'Referenti esterni (nomi separati da virgola)',
  `n_ore` INT NOT NULL COMMENT 'Durata corso: 1, 2, 4 o 5 ore',
  `giorno1` VARCHAR(2) DEFAULT NULL COMMENT 'Disponibile giorno 1: "sì" o "no"',
  `giorno2` VARCHAR(2) DEFAULT NULL COMMENT 'Disponibile giorno 2: "sì" o "no"',
  `posti_1_1` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 1, ora 1',
  `posti_1_2` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 1, ora 2',
  `posti_1_3` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 1, ora 3',
  `posti_1_4` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 1, ora 4',
  `posti_1_5` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 1, ora 5',
  `posti_2_1` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 2, ora 1',
  `posti_2_2` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 2, ora 2',
  `posti_2_3` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 2, ora 3',
  `posti_2_4` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 2, ora 4',
  `posti_2_5` INT NOT NULL DEFAULT 0 COMMENT 'Posti disponibili giorno 2, ora 5',
  `email_ref` VARCHAR(100) NOT NULL COMMENT 'Email referente per verifica OTP',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data creazione corso',
  PRIMARY KEY (`codice_corso`),
  KEY `idx_giorno1` (`giorno1`),
  KEY `idx_giorno2` (`giorno2`),
  KEY `idx_email_ref` (`email_ref`),
  KEY `idx_n_ore` (`n_ore`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Corsi/eventi creati dagli organizzatori';

-- ============================================
-- TABELLA: elenco_iscritti_giorno1
-- ============================================
-- Registrazioni studenti per il giorno 1
-- Una riga per studente con 5 colonne per le 5 ore
-- ============================================

CREATE TABLE `elenco_iscritti_giorno1` (
  `num_1` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(40) NOT NULL COMMENT 'Nome studente',
  `cognome` VARCHAR(40) NOT NULL COMMENT 'Cognome studente',
  `classe` VARCHAR(5) NOT NULL COMMENT 'Classe di appartenenza',
  `email` VARCHAR(60) NOT NULL COMMENT 'Email studente',
  `prima_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per prima ora',
  `seconda_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per seconda ora',
  `terza_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per terza ora',
  `quarta_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per quarta ora',
  `quinta_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per quinta ora',
  `registered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data registrazione',
  PRIMARY KEY (`num_1`),
  KEY `idx_email` (`email`),
  KEY `idx_classe` (`classe`),
  KEY `idx_registered_at` (`registered_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registrazioni studenti giorno 1';

-- ============================================
-- TABELLA: elenco_iscritti_giorno2
-- ============================================
-- Registrazioni studenti per il giorno 2
-- Struttura identica a giorno 1
-- ============================================

CREATE TABLE `elenco_iscritti_giorno2` (
  `num_2` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(40) NOT NULL COMMENT 'Nome studente',
  `cognome` VARCHAR(40) NOT NULL COMMENT 'Cognome studente',
  `classe` VARCHAR(5) NOT NULL COMMENT 'Classe di appartenenza',
  `email` VARCHAR(60) NOT NULL COMMENT 'Email studente',
  `prima_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per prima ora',
  `seconda_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per seconda ora',
  `terza_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per terza ora',
  `quarta_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per quarta ora',
  `quinta_ora` VARCHAR(50) DEFAULT NULL COMMENT 'Corso scelto per quinta ora',
  `registered_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data registrazione',
  PRIMARY KEY (`num_2`),
  KEY `idx_email` (`email`),
  KEY `idx_classe` (`classe`),
  KEY `idx_registered_at` (`registered_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registrazioni studenti giorno 2';

-- ============================================
-- TABELLA: elenco_relatori
-- ============================================
-- Cache dei relatori (studenti che hanno proposto corsi)
-- Utilizzata per auto-complete e statistiche
-- ============================================

CREATE TABLE `elenco_relatori` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(40) NOT NULL COMMENT 'Nome relatore',
  `cognome` VARCHAR(40) NOT NULL COMMENT 'Cognome relatore',
  `classe` VARCHAR(5) NOT NULL COMMENT 'Classe di appartenenza',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data prima apparizione',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_relatore` (`nome`, `cognome`, `classe`),
  KEY `idx_classe` (`classe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lista relatori/organizzatori';

-- ============================================
-- TABELLA: email_con_codice
-- ============================================
-- Codici OTP temporanei per verifica email
-- Validità: 5 minuti dal timestamp
-- Cleanup automatico dei codici scaduti
-- ============================================

CREATE TABLE `emails_for_verify` (
  `verificationId` VARCHAR(64) NOT NULL,
  `codice` VARCHAR(6) NOT NULL COMMENT 'Codice OTP a 6 cifre',
  `email` VARCHAR(100) NOT NULL COMMENT 'Email destinatario',
  `orario` BIGINT NOT NULL COMMENT 'Timestamp Unix per validità',
  `expires_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data creazione',
  PRIMARY KEY (`verificationId`),
  KEY `idx_email` (`email`),
  KEY `idx_codice` (`codice`),
  KEY `idx_orario` (`orario`) COMMENT 'Per cleanup codici scaduti'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Codici OTP temporanei (validità 5 minuti)';

-- ============================================
-- INDICI COMPOSITI PER PERFORMANCE
-- ============================================

-- Ottimizzazione ricerca corsi disponibili per giorno/ora
CREATE INDEX `idx_giorno1_posti` ON `corso` (`giorno1`, `posti_1_1`, `posti_1_2`, `posti_1_3`, `posti_1_4`, `posti_1_5`);
CREATE INDEX `idx_giorno2_posti` ON `corso` (`giorno2`, `posti_2_1`, `posti_2_2`, `posti_2_3`, `posti_2_4`, `posti_2_5`);

-- Ottimizzazione ricerca registrazioni per email
CREATE INDEX `idx_email_giorno1` ON `elenco_iscritti_giorno1` (`email`, `registered_at`);
CREATE INDEX `idx_email_giorno2` ON `elenco_iscritti_giorno2` (`email`, `registered_at`);

-- ============================================
-- STORED PROCEDURE (opzionali)
-- ============================================

-- Procedura per cleanup codici OTP scaduti (oltre 5 minuti)
DELIMITER //
CREATE PROCEDURE cleanup_expired_otp()
BEGIN
    DELETE FROM email_con_codice 
    WHERE orario < UNIX_TIMESTAMP() - 300; -- 300 secondi = 5 minuti
END //
DELIMITER ;

-- Procedura per contare registrazioni per corso
DELIMITER //
CREATE PROCEDURE count_registrations_per_course()
BEGIN
    SELECT 
        c.codice_corso,
        c.nome,
        (
            (SELECT COUNT(*) FROM elenco_iscritti_giorno1 WHERE prima_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno1 WHERE seconda_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno1 WHERE terza_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno1 WHERE quarta_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno1 WHERE quinta_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno2 WHERE prima_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno2 WHERE seconda_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno2 WHERE terza_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno2 WHERE quarta_ora = c.nome) +
            (SELECT COUNT(*) FROM elenco_iscritti_giorno2 WHERE quinta_ora = c.nome)
        ) AS total_registrations
    FROM corso c
    ORDER BY total_registrations DESC;
END //
DELIMITER ;

-- ============================================
-- DATI DI ESEMPIO (OPZIONALE - per testing)
-- ============================================
-- Decommenta le seguenti righe se vuoi inserire dati di test
-- ============================================

/*
-- Corso di esempio
INSERT INTO `corso` (
    `nome`, 
    `descrizione`, 
    `nome_cognome_classe_ref1`, 
    `n_ore`, 
    `giorno1`, 
    `giorno2`, 
    `posti_1_1`, 
    `posti_1_2`, 
    `posti_1_3`, 
    `posti_1_4`, 
    `posti_1_5`,
    `email_ref`
) VALUES (
    'Introduzione alla Programmazione',
    'Corso base di programmazione con JavaScript',
    'Mario Rossi - 5A',
    5,
    'sì',
    'no',
    30, 30, 30, 30, 30,
    'mario.rossi@example.com'
);

-- Registrazione studente esempio
INSERT INTO `elenco_iscritti_giorno1` (
    `nome`, 
    `cognome`, 
    `classe`, 
    `email`, 
    `prima_ora`, 
    `seconda_ora`, 
    `terza_ora`, 
    `quarta_ora`, 
    `quinta_ora`
) VALUES (
    'Luigi',
    'Verdi',
    '4B',
    'luigi.verdi@example.com',
    'Introduzione alla Programmazione',
    'Introduzione alla Programmazione',
    'Introduzione alla Programmazione',
    'Introduzione alla Programmazione',
    'Introduzione alla Programmazione'
);

-- Relatore esempio
INSERT INTO `elenco_relatori` (`nome`, `cognome`, `classe`) 
VALUES ('Mario', 'Rossi', '5A');
*/

-- ============================================
-- EVENTI PIANIFICATI (opzionali)
-- ============================================
-- Cleanup automatico codici OTP ogni ora
-- Decommenta se vuoi abilitare cleanup automatico
-- ============================================

/*
CREATE EVENT IF NOT EXISTS cleanup_otp_event
ON SCHEDULE EVERY 1 HOUR
DO CALL cleanup_expired_otp();
*/

-- ============================================
-- FINE SCHEMA
-- ============================================

-- Verifica creazione tabelle
SELECT 
    TABLE_NAME, 
    ENGINE, 
    TABLE_ROWS, 
    CREATE_TIME,
    TABLE_COMMENT
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'SchoolEventDays'
ORDER BY 
    TABLE_NAME;

-- ============================================
-- NOTE IMPORTANTI
-- ============================================
-- 1. Schema usa utf8mb4_unicode_ci per supporto completo caratteri
-- 2. Indici ottimizzati per query più frequenti dell'applicazione
-- 3. Stored procedure per operazioni comuni e manutenzione
-- 4. Cleanup OTP può essere automatizzato con EVENT o cron job
-- 5. Posti disponibili gestiti con aggiornamenti atomici per evitare race conditions
-- 6. Timestamp utilizzati per audit trail e analisi temporali
-- ============================================
