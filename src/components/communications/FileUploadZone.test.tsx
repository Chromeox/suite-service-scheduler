import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import FileUploadZone from './FileUploadZone';
import { useToast } from '@/components/ui/use-toast';

// Mock the useToast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn(),
  }),
}));

// Mock the isValidFile function
vi.mock('@/services/chat/attachments', () => ({
  isValidFile: vi.fn().mockImplementation((file) => {
    return file.size <= 5 * 1024 * 1024 && file.type !== 'application/exe';
  }),
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ALLOWED_FILE_TYPES: ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx'],
}));

describe('FileUploadZone', () => {
  const mockOnFilesSelected = vi.fn();
  const mockOnCancel = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as any).mockReturnValue({ toast: mockToast });
  });

  it('renders correctly in light mode', () => {
    render(
      <FileUploadZone 
        onFilesSelected={mockOnFilesSelected} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Check that the drag and drop zone is rendered
    expect(screen.getByText('Drag and drop files here or click to browse')).toBeInTheDocument();
    
    // Check that the buttons are rendered
    const cancelButton = screen.getByRole('button', { name: /cancel file upload/i });
    expect(cancelButton).toBeInTheDocument();
    
    const uploadButton = screen.getByRole('button', { name: /upload 0 files/i });
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).toBeDisabled(); // Should be disabled initially
  });

  it('renders correctly in dark mode', () => {
    render(
      <FileUploadZone 
        onFilesSelected={mockOnFilesSelected} 
        onCancel={mockOnCancel} 
      />,
      { theme: 'dark' }
    );
    
    // Check that the component is rendered in dark mode
    expect(screen.getByText('Drag and drop files here or click to browse')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <FileUploadZone 
        onFilesSelected={mockOnFilesSelected} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Click the cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    // Check that onCancel was called
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('handles file selection correctly', () => {
    render(
      <FileUploadZone 
        onFilesSelected={mockOnFilesSelected} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Create a mock file
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    // Mock the file input change event
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    
    fireEvent.change(fileInput);
    
    // Check that the file is displayed
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
    
    // The upload button should be enabled now
    const uploadButton = screen.getByRole('button', { name: /upload 1 file/i });
    expect(uploadButton).not.toBeDisabled();
    
    // Click the upload button
    fireEvent.click(uploadButton);
    
    // Check that onFilesSelected was called with the correct file
    expect(mockOnFilesSelected).toHaveBeenCalledWith([file]);
  });

  it('validates files correctly', () => {
    render(
      <FileUploadZone 
        onFilesSelected={mockOnFilesSelected} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Create a valid file
    const validFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    
    // Create an invalid file (too large)
    const largeFile = new File(['test content'], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 });
    
    // Create an invalid file (wrong type)
    const exeFile = new File(['test content'], 'virus.exe', { type: 'application/exe' });
    
    // Mock the file input change event with multiple files
    const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: [validFile, largeFile, exeFile],
    });
    
    fireEvent.change(fileInput);
    
    // Check that only the valid file is displayed
    expect(screen.getByText('test.jpg')).toBeInTheDocument();
    
    // Check that error messages are displayed for invalid files
    expect(screen.getByText(/large.jpg exceeds the maximum file size/i)).toBeInTheDocument();
    expect(screen.getByText(/virus.exe has an unsupported file type/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <FileUploadZone 
        onFilesSelected={mockOnFilesSelected} 
        onCancel={mockOnCancel} 
      />
    );
    
    // Check that the drag and drop zone has proper accessibility attributes
    const dragZone = screen.getByLabelText('Drag and drop files here or click to browse');
    expect(dragZone).toHaveAttribute('role', 'button');
    expect(dragZone).toHaveAttribute('tabIndex', '0');
    
    // Check that the buttons have proper accessibility attributes
    const cancelButton = screen.getByRole('button', { name: /cancel file upload/i });
    expect(cancelButton).toHaveAttribute('aria-label', 'Cancel file upload');
    
    const uploadButton = screen.getByRole('button', { name: /upload 0 files/i });
    expect(uploadButton).toHaveAttribute('aria-label', 'Upload 0 files');
  });
});
