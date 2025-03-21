import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import MessageAttachment from './MessageAttachment';
import { MessageAttachment as MessageAttachmentType } from '@/services/chat/types';

// Mock document.createElement and related functions for download testing
global.URL.createObjectURL = vi.fn();
const appendChildMock = vi.fn();
const removeChildMock = vi.fn();
const clickMock = vi.fn();

document.body.appendChild = appendChildMock;
document.body.removeChild = removeChildMock;

describe('MessageAttachment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock createElement to return an object with a click method
    document.createElement = vi.fn().mockImplementation(() => ({
      href: '',
      download: '',
      click: clickMock,
    }));
  });

  it('renders an image attachment correctly in light mode', () => {
    const imageAttachment: MessageAttachmentType = {
      id: '1',
      message_id: '1',
      file_name: 'test-image.jpg',
      file_url: 'https://example.com/test-image.jpg',
      file_size: 1024,
      file_type: 'image/jpeg',
      created_at: '2023-01-01T00:00:00Z',
    };

    render(
      <MessageAttachment attachment={imageAttachment} />
    );
    
    // Check that the image is rendered
    const image = screen.getByAltText('Image: test-image.jpg');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/test-image.jpg');
    
    // Check that the download button is rendered
    const downloadButton = screen.getByRole('button');
    expect(downloadButton).toHaveAttribute('aria-label', 'Download image: test-image.jpg');
  });

  it('renders an image attachment correctly in dark mode', () => {
    const imageAttachment: MessageAttachmentType = {
      id: '1',
      message_id: '1',
      file_name: 'test-image.jpg',
      file_url: 'https://example.com/test-image.jpg',
      file_size: 1024,
      file_type: 'image/jpeg',
      created_at: '2023-01-01T00:00:00Z',
    };

    render(
      <MessageAttachment attachment={imageAttachment} />,
      { theme: 'dark' }
    );
    
    // Check that the image is rendered
    const image = screen.getByAltText('Image: test-image.jpg');
    expect(image).toBeInTheDocument();
  });

  it('renders a non-image attachment correctly', () => {
    const pdfAttachment: MessageAttachmentType = {
      id: '2',
      message_id: '1',
      file_name: 'test-document.pdf',
      file_url: 'https://example.com/test-document.pdf',
      file_size: 2048,
      file_type: 'application/pdf',
      created_at: '2023-01-01T00:00:00Z',
    };

    render(
      <MessageAttachment attachment={pdfAttachment} />
    );
    
    // Check that the file name is displayed
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    
    // Check that the file size is displayed
    expect(screen.getByText('2 KB')).toBeInTheDocument();
    
    // Check that the download button is rendered
    const downloadButton = screen.getByRole('button');
    expect(downloadButton).toHaveAttribute('aria-label', 'Download file: test-document.pdf');
  });

  it('handles download when button is clicked', () => {
    const pdfAttachment: MessageAttachmentType = {
      id: '2',
      message_id: '1',
      file_name: 'test-document.pdf',
      file_url: 'https://example.com/test-document.pdf',
      file_size: 2048,
      file_type: 'application/pdf',
      created_at: '2023-01-01T00:00:00Z',
    };

    render(
      <MessageAttachment attachment={pdfAttachment} />
    );
    
    // Click the download button
    const downloadButton = screen.getByRole('button');
    fireEvent.click(downloadButton);
    
    // Check that the download functionality was triggered
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(clickMock).toHaveBeenCalled();
    expect(appendChildMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalled();
  });

  it('formats file size correctly', () => {
    // Test with bytes
    const smallAttachment: MessageAttachmentType = {
      id: '3',
      message_id: '1',
      file_name: 'small.txt',
      file_url: 'https://example.com/small.txt',
      file_size: 100,
      file_type: 'text/plain',
      created_at: '2023-01-01T00:00:00Z',
    };

    const { rerender } = render(
      <MessageAttachment attachment={smallAttachment} />
    );
    
    expect(screen.getByText('100 Bytes')).toBeInTheDocument();
    
    // Test with KB
    const mediumAttachment: MessageAttachmentType = {
      ...smallAttachment,
      id: '4',
      file_size: 1536,
    };

    rerender(
      <MessageAttachment attachment={mediumAttachment} />
    );
    
    expect(screen.getByText('1.5 KB')).toBeInTheDocument();
    
    // Test with MB
    const largeAttachment: MessageAttachmentType = {
      ...smallAttachment,
      id: '5',
      file_size: 1.5 * 1024 * 1024,
    };

    rerender(
      <MessageAttachment attachment={largeAttachment} />
    );
    
    expect(screen.getByText('1.5 MB')).toBeInTheDocument();
  });
});
