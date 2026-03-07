# Section Slug Generation Guide

This guide explains how section slugs work in your portfolio and provides simple, feasible ways to create and manage them.

## Overview

Sections are sub-pages within topics that allow you to organize content into smaller, focused pages. Each section needs a unique slug (URL-friendly identifier) within its parent topic.

**Example URL Structure:**
- Topic: `/learn-with-me/react-nextjs`
- Section: `/learn-with-me/react-nextjs/core-concepts`

## How Slugs Are Generated

### Automatic Generation

When you create or edit a section:

1. **Auto-generation from Label**: When you type a label (e.g., "Core Concepts"), a slug is automatically generated (e.g., "core-concepts")
2. **Uniqueness Check**: The system ensures no duplicate slugs exist within the same topic
3. **Auto-fix Duplicates**: If a duplicate is detected, a number is appended (e.g., "core-concepts-2")

### Slug Rules

Valid slugs must:
- ✅ Be lowercase
- ✅ Contain only letters, numbers, and hyphens
- ✅ Be 2-100 characters long
- ✅ Not start or end with hyphens
- ✅ Be unique within the same topic

**Examples:**
- ✅ `core-concepts`
- ✅ `best-practices`
- ✅ `getting-started-2024`
- ❌ `Core Concepts` (uppercase)
- ❌ `core_concepts` (underscores)
- ❌ `core-concepts-` (trailing hyphen)

## Three Simple Ways to Create Section Slugs

### Method 1: Automatic (Recommended) ✨

**The easiest way** - just type the label and the slug is generated automatically:

1. Click "Add Section" in the section editor
2. Enter the **Label** (e.g., "Advanced Patterns")
3. The **Slug** field auto-fills with "advanced-patterns"
4. Click "Save"

**When to use**: For new sections or when you're happy with the auto-generated slug.

---

### Method 2: Manual Edit

If you want a custom slug:

1. Create/edit a section
2. Enter the **Label**
3. Click in the **Slug** field
4. Edit the slug manually (e.g., change "advanced-patterns" to "advanced")
5. The system validates it as you type
6. Click "Save"

**When to use**: When you want a shorter or different slug than the auto-generated one.

---

### Method 3: Regenerate Button

If the slug doesn't match the label:

1. Create/edit a section
2. Enter the **Label**
3. Click the **"Regenerate"** button next to the Slug field
4. A new slug is generated from the current label
5. Click "Save"

**When to use**: When you've changed the label and want to update the slug to match.

## Fixing Existing Sections

### Option A: Fix Individual Sections

1. Go to the topic page
2. Click "Edit Sections"
3. Click the edit icon (✏️) on any section
4. Use Method 2 or 3 above to fix the slug
5. Click "Save"

### Option B: Regenerate All Slugs at Once

If you have many sections with bad slugs:

1. Go to the main Learn With Me page
2. Enter Edit Mode
3. Use the "Regenerate All Slugs" utility (if available)
4. This will regenerate all section slugs based on their labels

**Note**: This is a bulk operation - use with caution!

## Best Practices

### ✅ DO:
- Use descriptive labels that clearly indicate the section content
- Let the system auto-generate slugs from labels
- Keep slugs short but meaningful (3-5 words max)
- Use hyphens to separate words

### ❌ DON'T:
- Use single letters as slugs (e.g., "l", "d")
- Use special characters or spaces
- Create duplicate slugs within the same topic
- Use very long slugs (>50 characters)

## Examples

### Good Section Labels & Slugs:

| Label | Auto-Generated Slug | Notes |
|-------|---------------------|-------|
| "Core Concepts" | `core-concepts` | ✅ Clear and descriptive |
| "Best Practices" | `best-practices` | ✅ Standard format |
| "Getting Started" | `getting-started` | ✅ Common pattern |
| "Advanced Patterns" | `advanced-patterns` | ✅ Descriptive |

### Bad Section Labels & Slugs:

| Label | Generated Slug | Problem |
|-------|----------------|---------|
| "L" | `l` | ❌ Too short, not descriptive |
| "Demo" | `demo` | ⚠️ OK but could be more specific |
| "SD" | `sd` | ❌ Abbreviation, unclear |
| "Practices" | `practices` | ⚠️ OK but "best-practices" is better |

## Troubleshooting

### Problem: "Invalid slug format" error

**Solution**: 
- Remove any special characters
- Use only lowercase letters, numbers, and hyphens
- Ensure it doesn't start/end with hyphens

### Problem: "This slug is already used" warning

**Solution**:
- The system will auto-fix this on save by appending a number
- Or manually change the slug to something unique

### Problem: Slug doesn't match label

**Solution**:
- Click the "Regenerate" button next to the slug field
- Or manually edit the slug to match your preference

## Technical Details

### Functions Available

1. **`generateSlug(label: string)`**: Basic slug generation from text
2. **`generateUniqueSectionSlug(label, existingSections, excludeId?)`**: Generates unique slug within a topic
3. **`isValidSectionSlug(slug: string)`**: Validates slug format
4. **`regenerateSectionSlugs(topic)`**: Regenerates all slugs for a topic
5. **`regenerateAllSectionSlugs(topics)`**: Regenerates all slugs across all topics

### Where Slugs Are Used

- **URL Routing**: `/learn-with-me/[topic-slug]/[section-slug]`
- **Static Generation**: `generateStaticParams()` uses slugs to pre-render pages
- **Navigation**: Links between sections use slugs

## Summary

**The simplest approach**: Just type descriptive labels and let the system auto-generate slugs. The system handles uniqueness, validation, and formatting automatically.

For most use cases, **Method 1 (Automatic)** is all you need! 🎉

