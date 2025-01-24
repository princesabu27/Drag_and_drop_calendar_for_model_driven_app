# AI-Influencer Instagram Content Scheduler Documentation

## Overview
The Social Media Content Scheduler is a web-based application that allows users to schedule and manage social media content through a visual calendar interface. It integrates with Microsoft Dataverse and provides drag-and-drop functionality for scheduling posts.

## Key Features
- Visual calendar interface for content scheduling
- Drag-and-drop functionality for scheduling posts
- Image gallery of unscheduled content
- Real-time updates and synchronization
- Post status tracking
- Detailed content preview popups

## Technical Components

### 1. Calendar Interface
The application uses the jQuery WeekCalendar plugin with the following key configurations:
- 4 timeslots per hour
- Allows event overlap
- Dynamic height adjustment
- Color-coded events based on status

### 2. Status Color Coding
Posts are color-coded based on their status:
- Posted: Green (rgb(38, 166, 41))
- Not Posted: Red (rgb(255, 44, 44))
- Scheduled: Blue (rgb(0, 140, 255))
- Failed: Red (rgb(255, 44, 44))

### 3. Post Status Values
javascript
const postSuccessTitles = {
164280000: "Posted",
164280001: "Not Posted",
164280002: "Scheduled",
164280003: "Created",
164280004: "Failed"
};


## Core Functionality

### 1. Image Gallery
#### `fetchDataAndPopulateGallery()`
- Retrieves unscheduled content from Dataverse
- Filters for specific content categories
- Creates draggable image elements
- Updates the gallery view in real-time

### 2. Calendar Management
#### `fetchDataAndMarkCalendar()`
- Retrieves scheduled content within the current calendar view
- Creates calendar events with appropriate styling
- Handles date range calculations
- Updates calendar display

### 3. Drag and Drop
The application supports two types of drag operations:
1. New scheduling (from gallery to calendar)
2. Rescheduling (within calendar)

#### Key Validation Rules:
- Prevents scheduling in the past
- Validates date ranges
- Maintains scheduling queue for batch updates

### 4. Updates Management
#### `updatesQueue`
- Tracks pending changes
- Handles batch processing of updates
- Prevents duplicate updates for the same content

## User Interface Components

### 1. Popup Window
#### `appendPopupWindow()`
Parameters:
- `imageUrl`: URL of the content image
- `caption`: Post caption
- `description`: Post description
- `postedOn`: Scheduled/posted date
- `createdOn`: Creation date
- `postStatus`: Current status
- `postId`: Unique identifier
- `captionLang`: Caption language
- `descriptionLang`: Description language
- `view`: Display context

Features:
- Dynamic content display
- RTL support for Arabic content
- Status-specific action buttons
- Delete functionality
- Post now capability
- Schedule management

### 2. Control Buttons
- Refresh: Reloads all data
- Update Data: Processes queued changes
- Post Now: Immediate posting
- Schedule: Opens scheduling interface
- Delete: Removes content

## API Integration

### 1. Dataverse Integration
- CRUD operations for content management
- Real-time synchronization
- Status tracking and updates

### 2. Instagram Posting
Endpoint: Azure Logic App
javascript
POST https://prod-86.westus.logic.azure.com:443/workflows/[workflow-id]/triggers/manual/paths/invoke


Payload:
Javascript
{
postId: string,
imageUrl: string,
description: string
}


## Error Handling
- Validation for past dates
- API error catching and user feedback
- Status updates for failed operations
- Confirmation dialogs for critical actions

## Refresh Mechanisms
#### `refreshCalendar()`
- Clears existing calendar events
- Resets event data
- Clears update queue
- Fetches fresh data

## Language Support
- Bi-directional text support
- Arabic language handling
- Dynamic text alignment based on content language

## Best Practices
1. Always use the refresh button after making multiple changes
2. Confirm updates before saving
3. Check status colors for visual verification
4. Use drag-and-drop for precise scheduling
5. Review queued changes before updating

## Technical Requirements
- jQuery
- jQuery UI
- WeekCalendar plugin
- Microsoft Dataverse access
- Modern web browser with drag-and-drop support


This documentation provides an overview of the main components and functionality of the Social Media Content Scheduler. For specific implementation details, refer to the inline code comments and function documentation.
