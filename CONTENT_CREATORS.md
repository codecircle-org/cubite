# Cubite Content Creation Guide

This guide will help you create rich, interactive content using Cubite's powerful Editor.js integration and custom plugins.

## Table of Contents
- [Introduction to the Editor](#introduction-to-the-editor)
- [Accessing the Editor](#accessing-the-editor)
- [Basic Editing](#basic-editing)
- [Custom Plugins](#custom-plugins)
  - [Content Blocks](#content-blocks)
  - [Interactive Elements](#interactive-elements)
  - [Educational Components](#educational-components)
  - [Media Elements](#media-elements)
  - [Assessment Tools](#assessment-tools)

## Introduction to the Editor

Cubite uses [Editor.js](https://editorjs.io/), a powerful block-style editor that allows you to create rich, structured content. Unlike traditional WYSIWYG editors, Editor.js uses a block-based approach where each paragraph, image, or interactive element is a separate block.

## Accessing the Editor

1. Log in to your Cubite site
2. Navigate to the content section you wish to edit
3. Click "Create" or "Edit" to open the editor

## Basic Editing

- **Create a new block**: Press Enter to create a new paragraph block
- **Select block type**: Click the "+" button that appears or use the slash "/" command
- **Format text**: Select text to see formatting options (bold, italic, etc.)
- **Rearrange blocks**: Use the drag handle on the left of each block
- **Delete a block**: Select a block and press Backspace or Delete

## Custom Plugins

Cubite extends Editor.js with powerful custom plugins for creating engaging content.

### Content Blocks

#### Hero Section (`/plugins/hero`)
Create attractive hero sections with:
- Background images
- Headings
- Call-to-action buttons
- Custom styling options

```
Usage: Select "Hero" from the block menu, then configure:
1. Add a headline and subheadline
2. Upload a background image
3. Set text color, alignment, and overlay opacity
4. Add and configure buttons
```

#### Features (`/plugins/features`)
Showcase multiple features with icons and descriptions.

```
Usage: Select "Features" from the block menu, then:
1. Choose layout (grid, carousel, etc.)
2. Add feature items with icons, titles, and descriptions
3. Configure styling options
```

#### Testimonials (`/plugins/testimonials`)
Display customer or user testimonials.

```
Usage: Select "Testimonials" from the block menu, then:
1. Add testimonial quotes
2. Add author names and positions
3. Upload author photos
4. Choose display style (cards, carousel, etc.)
```

#### Call to Action (`/plugins/call-to-action`)
Create eye-catching CTAs.

```
Usage: Select "Call to Action" from the block menu, then:
1. Add headline and description
2. Configure button text and link
3. Set background color or image
4. Adjust spacing and alignment
```

### Interactive Elements

#### Email Subscription (`/plugins/email-subscription`)
Add email subscription forms.

```
Usage: Select "Email Subscription" from the block menu, then:
1. Set form title and description
2. Customize field labels and button text
3. Configure success message
4. Connect to your email service provider
```

#### Poll (`/plugins/poll`)
Create interactive polls for your audience.

```
Usage: Select "Poll" from the block menu, then:
1. Add your question
2. Add multiple answer options
3. Configure whether users can select multiple options
4. Set whether to show results immediately
```

### Educational Components

#### Courses (`/plugins/courses`)
Display course information or embed course modules.

```
Usage: Select "Course" from the block menu, then:
1. Add course title, description, and cover image
2. Add instructor information
3. List modules or lessons
4. Configure display options
```

#### WASM Editor (`/plugins/wasm-editor`)
Embed a WebAssembly code editor.

```
Usage: Select "WASM Editor" from the block menu, then:
1. Select the programming language
2. Add default code
3. Configure compilation options
4. Set editor height and theme
```

#### Jupyter Notebook (`/plugins/jupyter-notebook`)
Embed interactive Jupyter notebooks.

```
Usage: Select "Jupyter Notebook" from the block menu, then:
1. Upload a .ipynb file or enter a URL
2. Configure display options (code folding, output visibility)
3. Set execution permissions
```

#### Scratch (`/plugins/scratch`)
Embed Scratch programming blocks.

```
Usage: Select "Scratch" from the block menu, then:
1. Create Scratch blocks or import from a project
2. Configure canvas size
3. Set interaction permissions
```

### Media Elements

#### Image (`/plugins/image`)
Enhanced image embedding with additional options.

```
Usage: Select "Image" from the block menu, then:
1. Upload an image or provide URL
2. Add caption and alt text
3. Configure display options (size, alignment)
4. Add hover effects or lightbox options
```

#### YouTube (`/plugins/youtube`)
Embed YouTube videos with advanced options.

```
Usage: Select "YouTube" from the block menu, then:
1. Paste a YouTube URL or video ID
2. Configure autoplay, controls, start time
3. Set display size and responsive behavior
```

#### PDF (`/plugins/pdf`)
Embed PDF documents.

```
Usage: Select "PDF" from the block menu, then:
1. Upload a PDF file or provide URL
2. Configure viewer size
3. Set default zoom level
4. Toggle download button
```

#### Attachment (`/plugins/attachment`)
Add downloadable attachments.

```
Usage: Select "Attachment" from the block menu, then:
1. Upload file(s) or provide URL(s)
2. Add title and description
3. Configure display style
4. Set download tracking options
```

#### Template (`/plugins/template`)
Use and save reusable content templates.

```
Usage: Select "Template" from the block menu, then:
1. Choose from saved templates or create new
2. Customize template content
3. Save changes as new template (optional)
```

### Assessment Tools

#### Multiple Choice Problems (`/plugins/problem-multiple-choice`)
Create multiple-choice questions.

```
Usage: Select "Multiple Choice" from the block menu, then:
1. Add question text
2. Add answer options
3. Mark correct answer(s)
4. Add explanation for correct/incorrect answers
5. Configure scoring (optional)
```

#### Checkbox Problems (`/plugins/problem-checkbox`)
Create checkbox questions (multiple correct answers).

```
Usage: Select "Checkbox Problem" from the block menu, then:
1. Add question text
2. Add answer options
3. Mark all correct answers
4. Add explanation for correct/incorrect choices
5. Configure partial scoring (optional)
```

## Best Practices

1. **Plan your content structure** before starting to create complex elements
2. **Use a variety of blocks** to keep your content engaging
3. **Be consistent** with styling across your content
4. **Test interactive elements** thoroughly before publishing
5. **Use templates** for frequently used content patterns
6. **Optimize images** before uploading to improve loading speed
7. **Preview your content** on both desktop and mobile devices

## Troubleshooting

If you encounter issues with specific plugins:

1. Try refreshing the page
2. Check if all required fields are filled in
3. Ensure uploaded files are in the correct format and size
4. Contact your site administrator if problems persist

## Additional Resources

- [Editor.js Documentation](https://editorjs.io/getting-started/)
- [Content Creation Examples](https://editorjs.io/example/)

For technical assistance, please contact your Cubite administrator. 