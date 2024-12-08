// Fetch tags and display them in the grid
fetch('/api/v1/tags/')
  .then(response => response.json())
  .then(response => {
    const tags = response.data.tags;
    const tagsGrid = document.getElementById('tags-grid');
    const selectedTagsPreview = document.getElementById('selected-tags-preview');
    const selectedTagsInput = document.getElementById('selected-tags');

    // Clear the tags grid and selected tags preview
    tagsGrid.innerHTML = '';
    selectedTagsPreview.innerHTML = '';

    // If an article ID exists, fetch its tags
    const articleId = document.getElementById('article-id-container').getAttribute('data-article-id');
    if (articleId) {
      fetch(`/api/v1/tags/${articleId}`)
        .then(response => response.json())
        .then(response => {
          const articleTags = response.data.tags || [];
          const selectedTags = articleTags.map(tag => tag._id);

          // Display the selected tags
          articleTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('badge');
            tagElement.textContent = tag.name;
            tagElement.dataset.id = tag._id;

            selectedTagsPreview.appendChild(tagElement);
          });

          // Populate the hidden input field with selected tags
          selectedTagsInput.value = JSON.stringify(selectedTags);

          // Filter out the tags already selected for the article
          tags.forEach(tag => {
            const tagDiv = document.createElement('div');
            tagDiv.className = 'tag-item';
            tagDiv.textContent = tag.name;
            tagDiv.dataset.id = tag._id;

            // If the tag is already selected, mark it as 'selected'
            if (selectedTags.includes(tag._id)) {
              tagDiv.classList.add('selected');
            }

            tagDiv.addEventListener('click', () => {
              if (tagDiv.classList.contains('selected')) {
                removeTag(tag._id, tag.name, tagDiv);
              } else {
                addTag(tag._id, tag.name, tagDiv);
              }
            });

            tagsGrid.appendChild(tagDiv);
          });
        })
        .catch(error => {
          console.error('Error fetching article tags:', error);
        });
    } else {
      // If no articleId, display all available tags as unselected
      tags.forEach(tag => {
        const tagDiv = document.createElement('div');
        tagDiv.className = 'tag-item';
        tagDiv.textContent = tag.name;
        tagDiv.dataset.id = tag._id;

        tagDiv.addEventListener('click', () => {
          if (tagDiv.classList.contains('selected')) {
            removeTag(tag._id, tag.name, tagDiv);
          } else {
            addTag(tag._id, tag.name, tagDiv);
          }
        });

        tagsGrid.appendChild(tagDiv);
      });
    }
  })
  .catch(error => {
    console.error('Error fetching tags:', error);
  });


// Add tag to the selected list
function addTag(id, name, element) {
  element.classList.add('selected');

  const selectedTagsContainer = document.getElementById('selected-tags-preview');
  const tagBadge = document.createElement('span');
  tagBadge.className = 'badge';
  tagBadge.textContent = name;
  tagBadge.dataset.id = id;

  tagBadge.addEventListener('click', () => {
    removeTag(id, name, element);
  });

  selectedTagsContainer.appendChild(tagBadge);
  updateSelectedTagsInput();
}

// Remove tag from the selected list
function removeTag(id, name, element) {
  element.classList.remove('selected');

  const selectedTagsContainer = document.getElementById('selected-tags-preview');
  const tagBadge = Array.from(selectedTagsContainer.children).find(badge => badge.dataset.id === id);
  if (tagBadge) {
    selectedTagsContainer.removeChild(tagBadge);
  }
  updateSelectedTagsInput();
}

// Update the hidden input with selected tags
function updateSelectedTagsInput() {
  const selectedTagsContainer = document.getElementById('selected-tags-preview');
  const selectedIds = Array.from(selectedTagsContainer.children).map(tag => tag.dataset.id);
  document.getElementById('selected-tags').value = JSON.stringify(selectedIds);
}

// Fetch categories
fetch('/api/v1/categories/')
  .then(response => response.json())
  .then(response => {
    const data = response.data;
    const categorySelect = document.getElementById('category');

    const choosenCategory = categorySelect.options[categorySelect.selectedIndex].value;

    data.categories.forEach(category => {
      if (category._id !== choosenCategory) {
        const option = document.createElement('option');
        option.value = category._id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching categories:', error);
  });

// Handle form submission
document.querySelector('#editor-form').onsubmit = event => {
  event.preventDefault();

  // Collect form data
  const formData = {
    title: document.getElementById('title').value,
    summary: summaryEditor.root.innerHTML,
    content: contentEditor.root.innerHTML,
    thumbnail: document.getElementById('thumbnail').value,
    category_id: document.getElementById('category').value,
    tags: JSON.parse(document.getElementById('selected-tags').value), // Retrieve selected tag IDs
  };

  console.log("Form data:", formData);

  const accessToken = localStorage.getItem('accessToken');
  const articleId = document.getElementById('article-id-container').getAttribute('data-article-id');

  // Send form data to the server
  fetch(`/api/v1/articles/${articleId}`, {
    method: 'PUT',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert('Article updated successfully');
      console.log('Success:', data);
    })
    .catch(error => {
      alert('Error updating article');
      console.error('Submission error:', error);
    });
};
