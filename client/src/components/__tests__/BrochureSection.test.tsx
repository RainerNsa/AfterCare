import { describe, it, expect } from 'vitest'
import { renderWithChakra, screen } from '../../test/utils'
import BrochureSection from '../BrochureSection'

describe('BrochureSection', () => {
  const mockListItems = [
    'Avoid lifting more than 1 gallon of milk',
    'Take prescribed pain medications as directed',
    'Keep incision clean and dry'
  ]

  const mockTimelineItems = {
    postOpAppointment: 'Post-operative appointment scheduled at 4-6 weeks',
    urgentCare: 'Contact office immediately if warning signs occur',
    routineQuestions: 'Call office during business hours for routine questions'
  }

  const mockWarningItems = [
    'Fever greater than 100.4°F (38°C)',
    'Heavy bleeding requiring more than one pad per hour',
    'Severe unrelieved abdominal pain'
  ]

  describe('Basic Rendering', () => {
    it('renders with title and list items', () => {
      renderWithChakra(
        <BrochureSection
          title="Activity Restrictions"
          items={mockListItems}
          type="list"
        />
      )

      expect(screen.getByText('Activity Restrictions')).toBeInTheDocument()
      expect(screen.getByText('Avoid lifting more than 1 gallon of milk')).toBeInTheDocument()
      expect(screen.getByText('Take prescribed pain medications as directed')).toBeInTheDocument()
      expect(screen.getByText('Keep incision clean and dry')).toBeInTheDocument()
    })

    it('renders with timeline items', () => {
      renderWithChakra(
        <BrochureSection
          title="Follow-up Schedule"
          items={mockTimelineItems}
          type="timeline"
        />
      )

      expect(screen.getByText('Follow-up Schedule')).toBeInTheDocument()
      expect(screen.getByText('post Op Appointment:')).toBeInTheDocument()
      expect(screen.getByText('Post-operative appointment scheduled at 4-6 weeks')).toBeInTheDocument()
      expect(screen.getByText('urgent Care:')).toBeInTheDocument()
      expect(screen.getByText('routine Questions:')).toBeInTheDocument()
    })

    it('renders warning type with appropriate styling', () => {
      renderWithChakra(
        <BrochureSection
          title="Warning Signs"
          items={mockWarningItems}
          type="warning"
        />
      )

      expect(screen.getByText('Warning Signs')).toBeInTheDocument()
      expect(screen.getByText('Important')).toBeInTheDocument()
      expect(screen.getByText('Fever greater than 100.4°F (38°C)')).toBeInTheDocument()
    })
  })

  describe('Accessibility Features', () => {
    it('has proper ARIA labels and semantic structure', () => {
      renderWithChakra(
        <BrochureSection
          title="Activity Restrictions"
          items={mockListItems}
          type="list"
        />
      )

      const section = screen.getByRole('region')
      expect(section).toHaveAttribute('aria-labelledby', 'section-activity-restrictions')
      
      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveAttribute('id', 'section-activity-restrictions')
      expect(heading).toHaveTextContent('Activity Restrictions')
    })

    it('creates proper heading ID from title with spaces and special characters', () => {
      renderWithChakra(
        <BrochureSection
          title="Warning Signs - Contact Doctor"
          items={mockWarningItems}
          type="warning"
        />
      )

      const heading = screen.getByRole('heading', { level: 3 })
      expect(heading).toHaveAttribute('id', 'section-warning-signs---contact-doctor')
    })

    it('renders list items with proper semantic structure', () => {
      renderWithChakra(
        <BrochureSection
          title="Activity Restrictions"
          items={mockListItems}
          type="list"
        />
      )

      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
    })
  })

  describe('Display Types', () => {
    it('renders list type with unordered list', () => {
      renderWithChakra(
        <BrochureSection
          title="Activity Restrictions"
          items={mockListItems}
          type="list"
        />
      )

      const list = screen.getByRole('list')
      expect(list.tagName).toBe('UL')
    })

    it('renders timeline type with key-value pairs', () => {
      renderWithChakra(
        <BrochureSection
          title="Follow-up Schedule"
          items={mockTimelineItems}
          type="timeline"
        />
      )

      // Check that timeline items are rendered as key-value pairs
      expect(screen.getByText('post Op Appointment:')).toBeInTheDocument()
      expect(screen.getByText('urgent Care:')).toBeInTheDocument()
      expect(screen.getByText('routine Questions:')).toBeInTheDocument()
    })

    it('defaults to list type when no type specified', () => {
      renderWithChakra(
        <BrochureSection
          title="Default Type"
          items={mockListItems}
        />
      )

      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
    })
  })

  describe('Warning Type Styling', () => {
    it('displays warning badge for warning type', () => {
      renderWithChakra(
        <BrochureSection
          title="Warning Signs"
          items={mockWarningItems}
          type="warning"
        />
      )

      const badge = screen.getByText('Important')
      expect(badge).toBeInTheDocument()
    })

    it('does not display warning badge for non-warning types', () => {
      renderWithChakra(
        <BrochureSection
          title="Activity Restrictions"
          items={mockListItems}
          type="list"
        />
      )

      expect(screen.queryByText('Important')).not.toBeInTheDocument()
    })
  })

  describe('Collapsible Functionality', () => {
    it('renders as collapsible when isCollapsible is true', () => {
      renderWithChakra(
        <BrochureSection
          title="Collapsible Section"
          items={mockListItems}
          type="list"
          isCollapsible={true}
        />
      )

      // Should render accordion structure
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('renders as static content when isCollapsible is false', () => {
      renderWithChakra(
        <BrochureSection
          title="Static Section"
          items={mockListItems}
          type="list"
          isCollapsible={false}
        />
      )

      // Should not render accordion button
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('defaults to non-collapsible', () => {
      renderWithChakra(
        <BrochureSection
          title="Default Section"
          items={mockListItems}
          type="list"
        />
      )

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Empty Content Handling', () => {
    it('handles empty array gracefully', () => {
      renderWithChakra(
        <BrochureSection
          title="Empty Section"
          items={[]}
          type="list"
        />
      )

      expect(screen.getByText('Empty Section')).toBeInTheDocument()
      const list = screen.getByRole('list')
      expect(list).toBeInTheDocument()
      expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    })

    it('handles empty object gracefully', () => {
      renderWithChakra(
        <BrochureSection
          title="Empty Timeline"
          items={{}}
          type="timeline"
        />
      )

      expect(screen.getByText('Empty Timeline')).toBeInTheDocument()
      // Should not crash and should render the title
    })
  })

  describe('Content Formatting', () => {
    it('formats timeline keys properly', () => {
      const camelCaseItems = {
        postOpAppointment: 'Test appointment',
        followUpSchedule: 'Test schedule',
        emergencyContact: 'Test contact'
      }

      renderWithChakra(
        <BrochureSection
          title="Timeline Test"
          items={camelCaseItems}
          type="timeline"
        />
      )

      // Check that camelCase keys are converted to readable format
      expect(screen.getByText('post Op Appointment:')).toBeInTheDocument()
      expect(screen.getByText('follow Up Schedule:')).toBeInTheDocument()
      expect(screen.getByText('emergency Contact:')).toBeInTheDocument()
    })
  })
})
