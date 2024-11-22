# Reverse Auction Project

## Overview
A reverse auction platform where sellers compete to offer the lowest price for buyers' requirements. Built using Clean Architecture principles to ensure maintainability, testability, and separation of concerns.

## Architecture
This project implements Clean Architecture with the following layers:

### 1. Domain Layer - UseCases
- Contains enterprise business rules and entities
- Independent of external frameworks and tools
- Key entities:
  - Auction  
  - User (Buyer/Seller)  

### 2. Presentation Layer
- Contains UI components and logic
- Key components:
  - Components
  - Pages
  - Layouts

### 3. Infrastructure Layer
- Database implementations

## Technology Stack
- Frontend: React
- Database: Firebase
- Authentication: Firebase Auth

## Key Features
- User registration and authentication
- Create and manage reverse auctions
- Real-time bidding system
- Automated auction closing
- Bid history and tracking

## Getting Started
1. Clone the repository

2. Install dependencies

3. Configure environment variables (firebase connection string)

## Project Structure
src/
- domain/             
  - useCases/         
- infrastructure/     
    - database/       
    - repository/     
- presentation/       
    - components/     
    - img/            
    - layouts/        
    - pages/          
- store/             

## Testing

## Contact
rayanrn8@hotmail.com
