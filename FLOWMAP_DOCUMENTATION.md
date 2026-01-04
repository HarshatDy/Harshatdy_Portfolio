# Flowmap & FlowNode Feature Documentation

## Overview

This document provides comprehensive documentation for the Flowmap and FlowNode feature implementation. The feature enables a Notion-like editing experience where users can create, edit, delete, and organize knowledge nodes in a hierarchical structure, with support for dedicated HTML pages for each node.

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Architecture](#architecture)
3. [Files Added](#files-added)
4. [Files Modified](#files-modified)
5. [Data Structure](#data-structure)
6. [Key Features](#key-features)
7. [Component Details](#component-details)
8. [API Routes](#api-routes)
9. [Usage Guide](#usage-guide)

---

## Feature Overview

The Flowmap feature transforms the static learning topics into a dynamic, editable knowledge management system. Key capabilities include:

- **Notion-like Editing**: Create, edit, and delete nodes with context menus and drag-and-drop
- **Hierarchical Structure**: Support for nested topics and subtopics
- **Dedicated HTML Pages**: Each node can have a slug that creates a dedicated page (like blog posts)
- **Inline Editing**: Edit nodes directly from their content pages
- **Subtopic Management**: Manage subtopics directly on node pages
- **Visual Indicators**: Clear indicators for nodes with dedicated pages
- **Auto-save**: Changes automatically save to JSON file via API

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LearnWithMePage                          │
│  (Main page with edit/view mode toggle)                     │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                  │
┌───────▼────────┐  ┌──────▼──────────┐
│  FlowMap       │  │ FlowMapEditor   │
│  (View Mode)   │  │ (Edit Mode)     │
└───────┬────────┘  └──────┬──────────┘
        │                  │
        │          ┌───────▼──────────┐
        │          │  FlowNode        │
        │          │  (with context   │
        │          │   menu & drag)   │
        │          └──────────────────┘
        │
┌───────▼────────────────────────────┐
│  FlowNodePage                      │
│  (Dedicated HTML page for node)    │
│  - Edit Node Button                │
│  - SubtopicEditor Component        │
└───────┬────────────────────────────┘
        │
┌───────▼────────────────────────────┐
│  SubtopicEditor                     │
│  - Add/Edit/Delete Subtopics        │
│  - Navigate to subtopic pages       │
└─────────────────────────────────────┘
```

---

## Files Added

### 1. `app/data/flowmapData.ts`
**Purpose**: Core data management utilities for flowmap operations

**Key Functions**:
- `loadFlowmapData()`: Loads flowmap data from JSON file (client-side)
- `saveFlowmapData()`: Saves flowmap data via API route
- `findNodeById()`: Recursively finds a node by ID
- `findNodePath()`: Finds a node and its path in the tree
- `updateNodeInTree()`: Immutably updates a node in the tree
- `deleteNodeFromTree()`: Immutably deletes a node from the tree
- `addNodeToTree()`: Adds a new node to the tree
- `reorderNodes()`: Reorders nodes (for drag-and-drop)
- `getSiblings()`: Gets sibling nodes for a given node
- `generateNodeId()`: Generates unique IDs for new nodes
- `generateSlug()`: Generates URL-friendly slugs from titles

**Exports**:
- `Topic` interface
- All utility functions

---

### 2. `public/static/flowmap-data.json`
**Purpose**: JSON data file storing all flowmap nodes

**Structure**: Array of `Topic` objects with nested subtopics

**Usage**: 
- Loaded on page initialization
- Updated via API route when saving changes

---

### 3. `components/flow-node-context-menu.tsx`
**Purpose**: Context menu that appears on right-click or hover for node actions

**Features**:
- Edit node
- Add child node
- Delete node
- Move up/down (reorder)
- Positioned relative to cursor/node
- Auto-closes on outside click or Escape key
- Viewport-aware positioning

**Props**:
- `isOpen`: Boolean for menu visibility
- `position`: { x, y } coordinates
- `onClose`: Close handler
- `onEdit`: Edit handler
- `onAddChild`: Add child handler
- `onDelete`: Delete handler
- `onMoveUp/Down`: Reorder handlers
- `canMoveUp/Down`: Boolean flags for move availability

---

### 4. `components/node-editor-modal.tsx`
**Purpose**: Modal form for creating/editing nodes

**Features**:
- Form fields: Icon, Title, Description, Slug, Content
- Validation for required fields
- Slug generation from title (optional)
- Viewport-aware positioning (stays within screen)
- Smooth animations with Framer Motion

**Form Fields**:
- **Icon**: Emoji or text (required)
- **Title**: Node title (required)
- **Description**: Brief description (optional)
- **Slug**: URL-friendly identifier for HTML pages (optional)
- **Content**: Detailed content text (optional)

**Props**:
- `isOpen`: Boolean for modal visibility
- `node`: Topic object to edit (null for new nodes)
- `onClose`: Close handler
- `onSave`: Save handler with updated node
- `isNewNode`: Boolean flag for new vs edit mode

---

### 5. `components/flowmap-editor.tsx`
**Purpose**: Main editor wrapper component managing edit mode state

**Features**:
- Manages context menu state
- Manages editor modal state
- Handles all CRUD operations
- Coordinates drag-and-drop reordering
- Provides "Add Node" button for root level

**Key Functions**:
- `handleAddNode()`: Adds node at root or as child
- `handleEditNode()`: Opens editor modal
- `handleDeleteNode()`: Deletes with confirmation
- `handleReorderNodes()`: Handles drag-and-drop reorder
- `handleSaveNode()`: Saves node changes

**Props**:
- `topics`: Array of root topics
- `onNodeClick`: Click handler for navigation
- `onTopicsChange`: Callback when topics are modified

---

### 6. `components/subtopic-editor.tsx`
**Purpose**: Component for managing subtopics on a node page

**Features**:
- Add new subtopics
- Edit existing subtopics
- Delete subtopics with confirmation
- Visual indicators for subtopics with dedicated pages
- Navigate to subtopic pages
- Empty state when no subtopics

**UI Elements**:
- "Add Subtopic" button
- Grid layout of subtopic cards
- Hover actions (Edit, Delete, Navigate)
- Visual badge for nodes with slugs

**Props**:
- `subtopics`: Array of subtopic nodes
- `onSubtopicsChange`: Callback when subtopics are modified
- `parentTopicId`: ID of parent topic
- `allTopics`: Full topics tree for saving

---

### 7. `app/learn-with-me/[slug]/page.tsx`
**Purpose**: Dynamic route page for dedicated node pages

**Features**:
- Server-side rendering with static generation
- Finds topic by slug recursively
- Generates static params for all topics with slugs
- Handles 404 for invalid slugs

**Functions**:
- `generateStaticParams()`: Generates all possible slug routes
- `findTopicBySlug()`: Recursively searches for topic by slug

---

### 8. `app/learn-with-me/[slug]/FlowNodePage.tsx`
**Purpose**: Client component for rendering dedicated node pages

**Features**:
- Displays node content (icon, title, description, content)
- Edit node button in header
- SubtopicEditor for managing subtopics
- Navigation to subtopic pages
- Auto-saves changes to JSON file
- Custom cursor animations

**State Management**:
- `isLoaded`: Loading state for animations
- `isEditing`: Modal open state
- `currentTopic`: Current topic data

**Key Functions**:
- `handleEdit()`: Opens edit modal
- `handleSaveNode()`: Saves node changes
- `handleSubtopicsChange()`: Saves subtopic changes

---

### 9. `app/api/flowmap/route.ts`
**Purpose**: API route for reading and writing flowmap data

**Endpoints**:
- **GET**: Reads flowmap data from JSON file
- **POST**: Writes flowmap data to JSON file

**Features**:
- Server-side file system access
- Data validation
- Error handling
- Type safety with Topic interface

**Validation**:
- Ensures data is an array
- Validates each topic has required fields (id, title, icon)
- Recursively validates subtopics

---

## Files Modified

### 1. `components/flowmap.tsx`
**Changes**:
- Added drag-and-drop support using `@dnd-kit`
- Added `onReorder` prop for handling reordering
- Added `isEditMode` prop to enable/disable drag-and-drop
- Added `onContextMenu` prop for context menu handling
- Added `getCanMoveUp/Down` props for move button availability

**New Props**:
- `onReorder`: Callback for drag-and-drop reordering
- `isEditMode`: Boolean for edit mode
- `onContextMenu`: Context menu handler
- `getCanMoveUp/Down`: Functions to check move availability

---

### 2. `components/flow-node.tsx`
**Changes**:
- Added context menu trigger (right-click and hover button)
- Added drag handle for drag-and-drop
- Added `flowmap-node` class for cursor detection
- Added visual indicators for edit mode
- Added support for showing "Page" badge for nodes with slugs

**New Props**:
- `isEditMode`: Boolean for edit mode
- `isDraggable`: Boolean for drag enable
- `onContextMenu`: Context menu handler
- `canMoveUp/Down`: Boolean flags for move availability

**Visual Enhancements**:
- Drag handle icon (GripVertical)
- Context menu button (MoreVertical)
- "Page" badge for nodes with slugs

---

### 3. `components/content-viewer.tsx`
**Changes**:
- Added edit functionality when viewing inline content
- Added support for topic and allTopics props
- Added "Edit" button when topic is provided
- Added "View Full Page" button for nodes with slugs
- Integrated NodeEditorModal for editing

**New Props**:
- `topic`: Optional Topic object for editing
- `allTopics`: Optional full topics tree for saving
- `onTopicUpdate`: Optional callback for updates

---

### 4. `app/learn-with-me/page.tsx`
**Changes**:
- Added edit mode toggle
- Added data loading from JSON file
- Added FlowMapEditor component for edit mode
- Added save functionality
- Updated navigation to support slug-based routing
- Added CustomCursor component

**New State**:
- `isEditMode`: Boolean for edit/view mode
- `topics`: Root topics array
- `isLoading`: Loading state

**New Functions**:
- `handleSave()`: Saves all changes to JSON file
- `toggleEditMode()`: Switches between edit and view modes
- `handleTopicsChange()`: Updates topics when edited

---

### 5. `components/custom-cursor.tsx`
**Changes**:
- Added detection for `/learn-with-me` path
- Added cursor text animations for flowmap pages
- Added hover effects for flowmap nodes
- Added hover effects for buttons (Edit, Save, Add)
- Increased z-index for modal visibility

**New Features**:
- "EXPLORE TOPICS" text on scroll
- "CLICK TO LEARN" text in middle section
- "DIVE DEEPER" text further down
- "EXPLORE NODE" on node hover
- Button-specific text on hover

---

### 6. `package.json`
**Changes**:
- Added `@dnd-kit/core`: Core drag-and-drop functionality
- Added `@dnd-kit/sortable`: Sortable list support
- Added `@dnd-kit/utilities`: Utility functions
- Added `nanoid`: Unique ID generation

---

## Data Structure

### Topic Interface

```typescript
interface Topic {
  id: string                    // Unique identifier
  title: string                 // Node title (required)
  icon: string                  // Emoji or text icon (required)
  description?: string          // Brief description (optional)
  subtopics?: Topic[]           // Nested subtopics (optional)
  content?: string              // Detailed content (optional)
  slug?: string                 // URL-friendly identifier for HTML pages (optional)
}
```

### Example Structure

```json
{
  "id": "web-development",
  "title": "Web Development",
  "icon": "🌐",
  "description": "Frontend, backend, and fullstack web technologies",
  "slug": "web-development",
  "subtopics": [
    {
      "id": "frontend",
      "title": "Frontend",
      "icon": "⚡",
      "description": "User interface and interactive experiences",
      "slug": "frontend",
      "subtopics": [
        {
          "id": "react",
          "title": "React & Next.js",
          "icon": "⚛️",
          "slug": "react-nextjs",
          "content": "Learn advanced React patterns..."
        }
      ]
    }
  ]
}
```

---

## Key Features

### 1. Edit Mode
- Toggle between view and edit modes
- Context menus on right-click or hover
- Drag-and-drop reordering
- Visual indicators for edit mode

### 2. Node Management
- **Create**: Add nodes at root or as children
- **Edit**: Edit from flowmap or dedicated pages
- **Delete**: Delete with confirmation
- **Reorder**: Drag-and-drop or move up/down

### 3. Subtopic Management
- Add subtopics directly on node pages
- Edit subtopics inline
- Delete subtopics with confirmation
- Visual indicators for subtopics with pages

### 4. HTML Pages
- Nodes with slugs get dedicated pages
- URL structure: `/learn-with-me/{slug}`
- Static generation for all pages
- Navigation between pages

### 5. Auto-save
- Changes save to JSON file via API
- Server-side file system writes
- Validation before saving
- Success/error feedback

---

## Component Details

### FlowMap Component
- **Purpose**: Displays nodes in a grid layout
- **Modes**: View mode (clickable) or Edit mode (draggable)
- **Features**: Drag-and-drop, context menus, animations

### FlowNode Component
- **Purpose**: Individual node card
- **Features**: Hover effects, context menu, drag handle, page indicator

### FlowMapEditor Component
- **Purpose**: Wrapper for edit mode functionality
- **Features**: CRUD operations, state management, modal coordination

### SubtopicEditor Component
- **Purpose**: Manage subtopics on a node page
- **Features**: Add/edit/delete, visual indicators, navigation

### NodeEditorModal Component
- **Purpose**: Form for creating/editing nodes
- **Features**: Validation, slug generation, viewport-aware positioning

---

## API Routes

### GET `/api/flowmap`
- Reads `public/static/flowmap-data.json`
- Returns array of topics
- Error handling for file read failures

### POST `/api/flowmap`
- Validates request body (array of topics)
- Validates each topic structure
- Writes to `public/static/flowmap-data.json`
- Returns success/error response

**Request Body**:
```json
[
  {
    "id": "node-id",
    "title": "Node Title",
    "icon": "🌐",
    "description": "Description",
    "slug": "node-slug",
    "content": "Content text",
    "subtopics": []
  }
]
```

---

## Usage Guide

### Creating a New Node

1. **In Edit Mode**:
   - Click "Add Node" button (root level)
   - Or right-click a node → "Add Child"
   - Fill in the form (Icon, Title required)
   - Optionally add slug for HTML page
   - Click "Save"

2. **On Node Page**:
   - Click "Add Subtopic" button
   - Fill in the form
   - Click "Save"

### Editing a Node

1. **From Flowmap**:
   - Right-click node → "Edit"
   - Or hover and click menu button → "Edit"
   - Make changes in modal
   - Click "Save"

2. **From Node Page**:
   - Click "Edit Node" button in header
   - Make changes in modal
   - Click "Save"

3. **From Content View**:
   - Click "Edit" button
   - Make changes in modal
   - Click "Save"

### Creating HTML Pages

1. When creating/editing a node, add a **slug** field
2. Use "Generate from title" button for quick slug creation
3. Save the node
4. The node will now have a dedicated page at `/learn-with-me/{slug}`
5. Clicking the node navigates to its dedicated page

### Managing Subtopics

1. Navigate to a node's dedicated page
2. Use the "Subtopics" section
3. Click "Add Subtopic" to create new ones
4. Hover over subtopics to see Edit/Delete buttons
5. Click subtopics with slugs to navigate to their pages

### Reordering Nodes

1. Enter Edit Mode
2. Drag nodes to reorder (drag handle appears)
3. Or use context menu → "Move Up/Down"
4. Changes are saved when you click "Save" in header

### Deleting Nodes

1. Right-click node → "Delete"
2. Confirm deletion
3. Node and all its subtopics are removed
4. Save changes to persist deletion

---

## Technical Notes

### Drag-and-Drop
- Uses `@dnd-kit` library (React 18+ compatible)
- Only active in edit mode
- Visual feedback during drag (opacity change)
- Reorders siblings at the same level

### Context Menu
- Triggers on right-click or hover button
- Positioned relative to cursor/node
- Auto-closes on outside click or Escape
- Viewport-aware positioning

### Modal Positioning
- Uses flexbox container for viewport constraints
- Stays within screen bounds
- Responsive to window resize
- Smooth animations

### Cursor Animations
- Custom cursor follows mouse
- Rotating text around cursor
- Different text based on scroll position
- Hover effects for interactive elements
- High z-index for modal visibility

### Data Persistence
- Client-side: Loads from `/static/flowmap-data.json`
- Server-side: Writes to `public/static/flowmap-data.json`
- API route handles file I/O
- Validation before saving

---

## Future Enhancements

Potential improvements for future iterations:

1. **Rich Text Editor**: Replace textarea with rich text editor for content
2. **Image Upload**: Support for images in nodes
3. **Search/Filter**: Search nodes and filter by tags
4. **Templates**: Node templates for quick creation
5. **Undo/Redo**: History management for changes
6. **Export/Import**: Export to different formats
7. **Collaboration**: Multi-user editing support
8. **Version History**: Track changes over time
9. **Tags/Categories**: Organize nodes with tags
10. **Analytics**: Track node views and interactions

---

## Dependencies

### New Dependencies Added
- `@dnd-kit/core`: ^6.1.0
- `@dnd-kit/sortable`: ^8.0.0
- `@dnd-kit/utilities`: ^3.2.2
- `nanoid`: ^5.0.4

### Existing Dependencies Used
- `framer-motion`: Animations
- `lucide-react`: Icons
- `next`: Framework
- `react`: Core library

---

## File Structure Summary

```
app/
├── api/
│   └── flowmap/
│       └── route.ts                    # API route for data persistence
├── data/
│   └── flowmapData.ts                  # Data management utilities
├── learn-with-me/
│   ├── [slug]/
│   │   ├── page.tsx                    # Dynamic route page
│   │   └── FlowNodePage.tsx            # Node page component
│   └── page.tsx                        # Main flowmap page
components/
├── flow-node-context-menu.tsx           # Context menu component
├── flowmap-editor.tsx                  # Editor wrapper component
├── flowmap.tsx                         # Flowmap display component
├── flow-node.tsx                       # Individual node component
├── node-editor-modal.tsx               # Edit/create modal
└── subtopic-editor.tsx                 # Subtopic management component
public/
└── static/
    └── flowmap-data.json               # Data storage file
```

---

## Conclusion

The Flowmap feature provides a comprehensive, Notion-like editing experience for managing hierarchical knowledge structures. With support for dedicated HTML pages, inline editing, and intuitive subtopic management, it offers a powerful yet user-friendly interface for organizing and presenting information.

All changes are automatically saved to the JSON file, ensuring data persistence across sessions. The feature is fully integrated with the existing portfolio design and maintains consistency with the overall user experience.

