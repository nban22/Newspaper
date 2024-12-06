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

  // Handle form submission
  document.querySelector('#editor-form').onsubmit = event => {
    event.preventDefault();


    const formData = {
      title: document.getElementById('title').value,
      summary: summaryEditor.root.innerHTML,
      content: contentEditor.root.innerHTML,
      thumbnail: document.getElementById('thumbnail').value,
      category_id: document.getElementById('category').value,
    };

    console.log("Form data:", formData);

    const accessToken = localStorage.getItem('accessToken');

    fetch('/api/v1/articles/', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      alert('Article created successfully');
      console.log('Success:', data);
    })
    .catch(error => {
      alert('Error creating article');
      console.error('Submission error:', error);
    });
  };