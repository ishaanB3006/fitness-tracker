# MCP Tools Usage Guide

## What are MCP Tools?

MCP (Model Context Protocol) tools allow the AI assistant to directly interact with your Contentstack stack. Instead of writing code to fetch or manage content, you can simply ask me to perform operations, and I'll use these tools on your behalf.

## How to Use MCP Tools

You can use MCP tools in two ways:

### 1. **Direct Requests** (Recommended)
Simply ask me to perform Contentstack operations in natural language:

**Examples:**
- "Get all workouts from Contentstack"
- "Create a new workout entry"
- "Update the workout with ID 'w1'"
- "Publish the workout entry 'blt34dfb57eaeb74da3' to production"
- "Show me all content types in my stack"
- "Get all entries of type 'workout'"

### 2. **In Code** (Not Applicable)
MCP tools are only available to the AI assistant, not directly in your code. For your application code, continue using:
- The Contentstack SDK (`@contentstack/delivery-sdk`) - for reading content
- The Contentstack Management API - for writing/managing content

## Available MCP Tool Categories

### Content Types
- `get_all_content_types` - List all content types
- `get_a_single_content_type` - Get content type schema
- `create_an_entry` - Create new entries
- `update_an_entry` - Update existing entries
- `delete_an_entry` - Delete entries

### Entries
- `get_all_entries` - List entries with filtering/pagination
- `get_single_entry` - Get a specific entry
- `publish_an_entry` - Publish entries to environments
- `unpublish_an_entry` - Unpublish entries
- `localize_an_entry` - Create localized versions
- `unlocalize_an_entry` - Remove localization

### Assets
- `get_all_assets` - List assets
- `get_a_single_asset` - Get asset details
- `publish_an_asset` - Publish assets
- `unpublish_an_asset` - Unpublish assets
- `delete_an_asset` - Delete assets

### Environments
- `get_all_environments` - List environments
- `get_an_environment` - Get environment details
- `create_an_environment` - Create new environment
- `update_an_environment` - Update environment
- `delete_an_environment` - Delete environment

### Branches
- `get_all_branches` - List branches
- `get_a_single_branch` - Get branch details
- `merge_branch` - Merge branches

### Releases
- `get_all_releases` - List releases
- `create_a_release` - Create release
- `add_items_to_a_release` - Add items to release
- `deploy_a_release` - Deploy release to environments

### Taxonomies & Terms
- `get_all_taxonomies` - List taxonomies
- `create_a_taxonomy` - Create taxonomy
- `get_all_terms` - List terms in taxonomy
- `create_a_term` - Create term
- `update_a_term` - Update term
- `delete_a_term` - Delete term

### CDN/Delivery API
- `get_all_entries_cdn` - Get published entries via CDN
- `get_a_single_entry_cdn` - Get published entry via CDN
- `get_all_assets_cdn` - Get published assets via CDN
- `get_a_single_asset_cdn` - Get published asset via CDN

## Common Use Cases

### 1. Fetching Content

**Ask me:**
```
"Get all workout entries from Contentstack"
"Show me the workout entry with ID 'blt34dfb57eaeb74da3'"
"Get all entries of content type 'workout' published in 'production' environment"
```

### 2. Creating Content

**Ask me:**
```
"Create a new workout entry with title 'Evening Yoga Flow', duration 30 minutes, difficulty 'beginner'"
"Create a meal plan entry for 'Keto Breakfast'"
```

### 3. Updating Content

**Ask me:**
```
"Update workout 'w1' to change the duration to 35 minutes"
"Update the meal plan entry 'm1' to add a new meal"
```

### 4. Publishing Content

**Ask me:**
```
"Publish workout entry 'blt34dfb57eaeb74da3' to production environment"
"Publish all workout entries to staging"
```

### 5. Managing Structure

**Ask me:**
```
"Show me all content types in my stack"
"What's the schema for the 'workout' content type?"
"List all environments"
"Show me all branches"
```

### 6. Bulk Operations

**Ask me:**
```
"Get all workouts with difficulty 'beginner'"
"Get all entries created in the last week"
"Show me all unpublished entries"
```

## Example Conversations

### Example 1: Fetching Workouts
**You:** "Get all workout entries from Contentstack"

**I'll use:** `mcp_contentstack_get_all_entries` with `content_type_uid: "workout"`

### Example 2: Creating a Workout
**You:** "Create a new workout called 'Sunrise Stretch' with 20 minutes duration, beginner difficulty"

**I'll use:** `mcp_contentstack_create_an_entry` with the workout data

### Example 3: Publishing
**You:** "Publish workout entry 'blt123' to production environment in en-us locale"

**I'll use:** `mcp_contentstack_publish_an_entry` with the entry ID, environment, and locale

### Example 4: Exploring Structure
**You:** "What content types do I have? Show me the workout content type schema"

**I'll use:** 
1. `mcp_contentstack_get_all_content_types` to list types
2. `mcp_contentstack_get_a_single_content_type` to get the schema

## Important Notes

1. **Authentication**: MCP tools use your configured Contentstack credentials automatically
2. **Branches**: By default, operations use the `main` branch unless you specify otherwise
3. **Locales**: Many operations require locale specification (e.g., `en-us`)
4. **Environments**: Publishing operations require environment names/UIDs
5. **Entry Data Format**: When creating/updating entries, data must be wrapped: `{'entry': {...data}}`

## When to Use MCP Tools vs SDK

### Use MCP Tools (Ask Me) When:
- ✅ You want quick content operations without writing code
- ✅ You're exploring your Contentstack structure
- ✅ You need one-off content management tasks
- ✅ You want to test content operations
- ✅ You're setting up initial content

### Use SDK/API (Write Code) When:
- ✅ You need content in your application runtime
- ✅ You're building user-facing features
- ✅ You need real-time content fetching
- ✅ You're implementing server-side rendering
- ✅ You need programmatic content management in your app

## Getting Started

Try asking me:
1. "Show me all content types in my Contentstack stack"
2. "Get all workout entries"
3. "What environments do I have configured?"
4. "Show me the schema for the workout content type"

I'll use the appropriate MCP tools to fetch this information for you!

