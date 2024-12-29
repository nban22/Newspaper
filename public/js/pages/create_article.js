// Fetch categories
fetch('/api/v1/categories/')
  .then(response => response.json())
  .then(response => {
    const data = response.data;
    const categorySelect = document.getElementById('category');
    data.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category._id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching categories:', error);
  });

// Fetch tags and display them in the grid
fetch('/api/v1/tags/')
  .then(response => response.json())
  .then(response => {
    const tags = response.data.tags;
    const tagsGrid = document.getElementById('tags-grid');

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
    is_premium: document.getElementById('is_premium').checked,
  };

  // Convert formData to a JSON string
  const formDataJson = JSON.stringify(formData);

  // Calculate size of formData in bytes
  const formDataSize = new Blob([formDataJson]).size;
  console.log(`Form size: ${formDataSize} bytes`);


  // Retrieve access token from local storage
  const accessToken = localStorage.getItem('accessToken');

  // Send form data to the server
  fetch('/api/v1/articles/', {
    method: 'POST',
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
      alert('Article created successfully');
      console.log('Success:', data);
      window.location.href = '/';
    })
    .catch(error => {
      alert('Error creating article');
      console.error('Submission error:', error);
    });
};
