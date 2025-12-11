# Creating Meal Plan, Meal, and Macros Entries

## Content Type Structure

Based on your codebase structure, here's how to create entries:

### 1. Macros (if separate content type)
If macros is a separate content type, create entries like:

```json
{
  "entry": {
    "title": "High Protein Macros",
    "protein": 180,
    "carbs": 200,
    "fat": 70,
    "fiber": 35
  }
}
```

### 2. Meal Entries
If meal is a separate content type:

```json
{
  "entry": {
    "title": "Protein Power Breakfast",
    "name": "Protein Power Breakfast",
    "type": "breakfast",
    "calories": 520,
    "protein": 45,
    "carbs": 40,
    "fat": 18,
    "fiber": 0,
    "prep_time": 10,
    "cook_time": 10,
    "ingredients": [
      "4 egg whites",
      "2 whole eggs",
      "spinach",
      "whole grain toast",
      "avocado"
    ],
    "instructions": "Scramble eggs with spinach. Toast bread. Slice avocado. Serve together."
  }
}
```

### 3. Meal Plan Entries
If meal_plan is the main content type with nested meals:

```json
{
  "entry": {
    "title": "High Protein Meal Plan",
    "description": "Fuel your muscle growth with this protein-packed meal plan. Perfect for strength training and muscle building.",
    "diet_type": "high-protein",
    "total_calories": 2150,
    "macros": {
      "protein": 180,
      "carbs": 200,
      "fat": 70,
      "fiber": 35
    },
    "meals": [
      {
        "name": "Protein Power Breakfast",
        "type": "breakfast",
        "calories": 520,
        "macros": {
          "protein": 45,
          "carbs": 40,
          "fat": 18
        },
        "prep_time": 10,
        "cook_time": 10,
        "ingredients": [
          "4 egg whites",
          "2 whole eggs",
          "spinach",
          "whole grain toast",
          "avocado"
        ],
        "instructions": "Scramble eggs with spinach. Toast bread. Slice avocado."
      },
      {
        "name": "Grilled Chicken Salad",
        "type": "lunch",
        "calories": 580,
        "macros": {
          "protein": 50,
          "carbs": 35,
          "fat": 25
        },
        "prep_time": 15,
        "cook_time": 15,
        "ingredients": [
          "grilled chicken breast",
          "mixed greens",
          "quinoa",
          "cherry tomatoes",
          "olive oil"
        ]
      },
      {
        "name": "Salmon & Sweet Potato",
        "type": "dinner",
        "calories": 650,
        "macros": {
          "protein": 55,
          "carbs": 55,
          "fat": 22
        },
        "prep_time": 10,
        "cook_time": 25,
        "ingredients": [
          "salmon fillet",
          "sweet potato",
          "broccoli",
          "lemon",
          "herbs"
        ]
      },
      {
        "name": "Greek Yogurt Parfait",
        "type": "snack",
        "calories": 400,
        "macros": {
          "protein": 30,
          "carbs": 70,
          "fat": 5
        },
        "prep_time": 5,
        "cook_time": 0,
        "ingredients": [
          "Greek yogurt",
          "berries",
          "granola",
          "honey"
        ]
      }
    ],
    "allergy_tags": [],
    "tags": ["high-protein", "muscle-building"]
  }
}
```

## Using MCP Tools

Once authentication is restored, you can use these MCP commands:

### Create Macros Entry
```python
mcp_contentstack_create_an_entry(
    content_type_uid="macros",
    entry_data={'entry': {'title': 'High Protein Macros', 'protein': 180, 'carbs': 200, 'fat': 70, 'fiber': 35}},
    locale="en-us",
    branch="main"
)
```

### Create Meal Entry
```python
mcp_contentstack_create_an_entry(
    content_type_uid="meal",
    entry_data={'entry': {
        'title': 'Protein Power Breakfast',
        'name': 'Protein Power Breakfast',
        'type': 'breakfast',
        'calories': 520,
        'protein': 45,
        'carbs': 40,
        'fat': 18,
        'prep_time': 10,
        'cook_time': 10,
        'ingredients': ['4 egg whites', '2 whole eggs', 'spinach', 'whole grain toast', 'avocado']
    }},
    locale="en-us",
    branch="main"
)
```

### Create Meal Plan Entry
```python
mcp_contentstack_create_an_entry(
    content_type_uid="meal_plan",
    entry_data={'entry': {
        'title': 'High Protein Meal Plan',
        'description': 'Fuel your muscle growth with this protein-packed meal plan.',
        'diet_type': 'high-protein',
        'total_calories': 2150,
        'protein': 180,
        'carbs': 200,
        'fat': 70,
        'fiber': 35,
        'meals': [...]
    }},
    locale="en-us",
    branch="main"
)
```

## Note on Authentication

If you're getting authentication errors, you may need to:
1. Refresh your Contentstack MCP token
2. Check your `.cursor/mcp.json` configuration
3. Verify your Contentstack API credentials

## Alternative: Check Content Types First

Before creating entries, verify the exact content type UIDs by fetching all content types:
```python
mcp_contentstack_get_all_content_types(branch="main")
```

This will show you the exact UIDs to use (might be `meal_plan`, `mealplan`, `meal`, `macros`, etc.)

