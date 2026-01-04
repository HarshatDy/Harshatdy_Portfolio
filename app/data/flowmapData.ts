export interface Section {
  id: string
  label: string
  icon: string
  slug: string
  content?: string
}

export interface Topic {
  id: string
  title: string
  icon: string
  description?: string
  subtopics?: Topic[]
  content?: string
  slug?: string // For HTML page routing (like blog posts)
  sections?: Section[] // Sections like "Core Concepts", "Best Practices", etc.
}

// Load flowmap data from JSON file
export async function loadFlowmapData(): Promise<Topic[]> {
  try {
    const response = await fetch('/static/flowmap-data.json')
    if (!response.ok) {
      throw new Error('Failed to load flowmap data')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error loading flowmap data:', error)
    return []
  }
}

// Save flowmap data to JSON file via API
export async function saveFlowmapData(topics: Topic[]): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch('/api/flowmap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(topics),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to save flowmap data',
      }
    }

    return {
      success: true,
      message: data.message || 'Flowmap data saved successfully',
    }
  } catch (error) {
    console.error('Error saving flowmap data:', error)
    return {
      success: false,
      error: 'Network error while saving flowmap data',
    }
  }
}

// Find a node by ID recursively
export function findNodeById(topics: Topic[], id: string): Topic | null {
  for (const topic of topics) {
    if (topic.id === id) {
      return topic
    }
    if (topic.subtopics && topic.subtopics.length > 0) {
      const found = findNodeById(topic.subtopics, id)
      if (found) return found
    }
  }
  return null
}

// Find parent node and path to a node by ID
export function findNodePath(
  topics: Topic[],
  id: string,
  path: Topic[] = []
): { node: Topic; path: Topic[] } | null {
  for (const topic of topics) {
    const currentPath = [...path, topic]
    if (topic.id === id) {
      return { node: topic, path: currentPath }
    }
    if (topic.subtopics && topic.subtopics.length > 0) {
      const found = findNodePath(topic.subtopics, id, currentPath)
      if (found) return found
    }
  }
  return null
}

// Update a node in the tree immutably
export function updateNodeInTree(
  topics: Topic[],
  id: string,
  updates: Partial<Topic>
): Topic[] {
  return topics.map((topic) => {
    if (topic.id === id) {
      return { ...topic, ...updates }
    }
    if (topic.subtopics && topic.subtopics.length > 0) {
      return {
        ...topic,
        subtopics: updateNodeInTree(topic.subtopics, id, updates),
      }
    }
    return topic
  })
}

// Delete a node from the tree immutably
export function deleteNodeFromTree(topics: Topic[], id: string): Topic[] {
  return topics
    .filter((topic) => topic.id !== id)
    .map((topic) => {
      if (topic.subtopics && topic.subtopics.length > 0) {
        return {
          ...topic,
          subtopics: deleteNodeFromTree(topic.subtopics, id),
        }
      }
      return topic
    })
}

// Add a node to the tree
export function addNodeToTree(
  topics: Topic[],
  parentId: string | null,
  newNode: Topic
): Topic[] {
  if (parentId === null) {
    // Add to root level
    return [...topics, newNode]
  }

  return topics.map((topic) => {
    if (topic.id === parentId) {
      return {
        ...topic,
        subtopics: [...(topic.subtopics || []), newNode],
      }
    }
    if (topic.subtopics && topic.subtopics.length > 0) {
      return {
        ...topic,
        subtopics: addNodeToTree(topic.subtopics, parentId, newNode),
      }
    }
    return topic
  })
}

// Move a node to a new position (reorder siblings)
export function reorderNodes(
  topics: Topic[],
  parentId: string | null,
  sourceIndex: number,
  destinationIndex: number
): Topic[] {
  if (parentId === null) {
    // Reorder root level
    const newTopics = [...topics]
    const [removed] = newTopics.splice(sourceIndex, 1)
    newTopics.splice(destinationIndex, 0, removed)
    return newTopics
  }

  return topics.map((topic) => {
    if (topic.id === parentId && topic.subtopics) {
      const newSubtopics = [...topic.subtopics]
      const [removed] = newSubtopics.splice(sourceIndex, 1)
      newSubtopics.splice(destinationIndex, 0, removed)
      return {
        ...topic,
        subtopics: newSubtopics,
      }
    }
    if (topic.subtopics && topic.subtopics.length > 0) {
      return {
        ...topic,
        subtopics: reorderNodes(topic.subtopics, parentId, sourceIndex, destinationIndex),
      }
    }
    return topic
  })
}

// Get siblings of a node
export function getSiblings(topics: Topic[], id: string): { siblings: Topic[]; parentId: string | null } | null {
  const pathResult = findNodePath(topics, id)
  if (!pathResult) return null

  const { path } = pathResult
  if (path.length === 1) {
    // Root level
    return { siblings: topics, parentId: null }
  }

  const parent = path[path.length - 2]
  return { siblings: parent.subtopics || [], parentId: parent.id }
}

// Generate unique ID
export function generateNodeId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

