// Import necessary modules and dependencies for testing
import React from 'react';
import { render } from '@testing-library/react';
import Home from '../src/app/page'; // Replace with correct path to Home component
import '@testing-library/jest-dom'
// Mock dependencies or setup Firebase mock
jest.mock('../src/utils/authUtils.js', () => ({
  getAllDocuments: jest.fn().mockResolvedValue([]), // Mocking the function to return an empty array
}));
jest.mock('../firebase.config.js', () => ({
  db: {}, // Mocking the Firebase db object
}));

describe('Home Page Component', () => {
  it('renders without crashing', async () => {
    const { getByText } = render(<Home />);
    
    // Assert that the main heading is present
    expect(getByText('School Supplies Inventory')).toBeInTheDocument();
    
    // You can add more assertions here to verify other parts of your component if needed
  });
});
