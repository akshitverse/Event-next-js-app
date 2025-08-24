
# Minimal RSVP App (Next.js + Supabase)

A simple **RSVP (Répondez s'il vous plaît) application** built with **Next.js** and **Supabase**, allowing users to create events, RSVP to events, and manage their account.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Technologies Used](#technologies-used)  
4. [Setup Instructions](#setup-instructions)  
5. [Database Schema](#database-schema)  
6. [File Structure](#file-structure)  
7. [Usage](#usage)  
8. [Future Improvements](#future-improvements)  

---

## Project Overview

This minimal app provides:

- User registration and authentication
- Event creation
- RSVP management
- Account deletion with cascading removal of events and RSVPs

It is designed as a simple MVP while demonstrating **referential integrity** and **role-based access** using Supabase RLS (Row Level Security).

---

## Features

### 1. User Registration & Authentication

- Sign up with email, password, and full name
- Login / Logout
- Session management
- Access to personal profile

### 2. Event Creation

- Create events with:
  - Title
  - Description
  - Date & time
  - Location (optional)
  - Visibility: Public / Private (MVP defaults to public)
- Edit or delete own events
- Browse all public events

### 3. RSVP to Events

- RSVP: Yes / No / Maybe
- View personal RSVP status
- View event counts for Yes/No/Maybe
- Delete own RSVP
- Event creators can see RSVPs to their events

### 4. Account Management

- View account information
- Delete account (automatically deletes user-created events and RSVPs)
- Session and authentication handled via Supabase

---

## Technologies Used

- **Frontend:** Next.js, React
- **Backend / Database:** Supabase (PostgreSQL + Auth)
- **Authentication:** Supabase Auth
- **Hosting:** Vercel (recommended)

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repo-url>
cd rsvp-app

