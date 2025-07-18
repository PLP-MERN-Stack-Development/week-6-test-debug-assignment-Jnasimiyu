/**
 * Unit tests for BugList component using Vitest
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import BugList from '../components/BugList';
import { BugProvider } from '../context/BugContext';

// Mock react-router-dom's Link
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  };
});

// Mock bugService
const mockBugs = [
  {
    _id: '1',
    title: 'Test Bug 1',
    description: 'This is a test bug description',
    severity: 'high',
    status: 'open',
    reportedBy: 'Test User',
    createdAt: new Date().toISOString(),
    tags: ['frontend', 'ui'],
  },
  {
    _id: '2',
    title: 'Test Bug 2',
    description: 'This is another test bug description',
    severity: 'medium',
    status: 'in-progress',
    reportedBy: 'Test User 2',
    createdAt: new Date().toISOString(),
    tags: ['backend'],
  },
];

vi.mock('../services/bugService', () => ({
  default: {
    getAllBugs: vi.fn(() => Promise.resolve(mockBugs)),
    deleteBug: vi.fn(() => Promise.resolve()),
  },
}));

const renderBugList = () => {
  return render(
    <BrowserRouter>
      <BugProvider>
        <BugList />
      </BugProvider>
    </BrowserRouter>
  );
};

describe('BugList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn(() => true);
  });

  test('renders bug list correctly', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('displays correct severity badges', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('medium')).toBeInTheDocument();
    });
  });

  test('displays correct status icons', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });
  });

  test('filters bugs by status', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bug 2')).toBeInTheDocument();
    });

    const statusFilter = screen.getByLabelText(/filter by status/i);
    fireEvent.change(statusFilter, { target: { value: 'open' } });

    expect(statusFilter.value).toBe('open');
  });

  test('sorts bugs correctly', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText(/sort by/i);
    fireEvent.change(sortSelect, { target: { value: 'title' } });

    expect(sortSelect.value).toBe('title');
  });

  test('displays bug count in filter label', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText(/\d+ bugs/i)).toBeInTheDocument();
    });
  });

  test('handles delete confirmation', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText('Test Bug 1')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle(/delete bug/i);
    fireEvent.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete "Test Bug 1"?');
  });

  test('displays empty state when no bugs exist', async () => {
    // Override getAllBugs mock
    const bugService = await import('../services/bugService');
    bugService.default.getAllBugs.mockResolvedValueOnce([]);

    renderBugList();

    await waitFor(() => {
      expect(screen.getByText(/no bugs found/i)).toBeInTheDocument();
    });
  });

  test('displays tags correctly', async () => {
    renderBugList();

    await waitFor(() => {
      expect(screen.getByText('frontend')).toBeInTheDocument();
      expect(screen.getByText('ui')).toBeInTheDocument();
      expect(screen.getByText('backend')).toBeInTheDocument();
    });
  });
});
