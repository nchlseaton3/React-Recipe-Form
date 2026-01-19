import { useState } from "react"
import "./RecipeSubmissionForm.css"

const difficultyOptions = ["Easy", "Medium", "Hard"]
const categoryOptions = ["Appetizer", "Main Course", "Dessert", "Side Dish", "Beverage"]
const cuisineOptions = ["American", "Italian", "Mexican", "Asian", "Mediterranean", "Other"]

const RecipeSubmissionForm = () => {

  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    servings: "",
    difficulty: "",
    category: "",
    cuisine: "",
    imageUrl: "",
  })

  
  const [errors, setErrors] = useState({})

  
  const [submittedRecipe, setSubmittedRecipe] = useState(null)

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  
  const validateForm = data => {
    const newErrors = {}

    
    const title = data.title.trim()
    if (!title) newErrors.title = "Title is required"
    else if (title.length < 3) newErrors.title = "Title must be at least 3 characters"
    else if (title.length > 50) newErrors.title = "Title must be 50 characters or less"

   
    const desc = data.description.trim()
    if (!desc) newErrors.description = "Description is required"
    else if (desc.length < 10) newErrors.description = "Description must be at least 10 characters"
    else if (desc.length > 500) newErrors.description = "Description must be 500 characters or less"

    
    const servingsNum = Number(data.servings)
    if (!data.servings) newErrors.servings = "Servings is required"
    else if (Number.isNaN(servingsNum)) newErrors.servings = "Servings must be a number"
    else if (servingsNum < 1 || servingsNum > 20) newErrors.servings = "Servings must be between 1 and 20"

    
    if (!data.difficulty) newErrors.difficulty = "Difficulty is required"
    if (!data.category) newErrors.category = "Category is required"
    if (!data.cuisine) newErrors.cuisine = "Cuisine type is required"

    
    if (data.imageUrl.trim()) {
      try {
        new URL(data.imageUrl)
      } catch {
        newErrors.imageUrl = "Please enter a valid URL"
      }
    }

    return newErrors
  }

  const handleSubmit = event => {
    event.preventDefault()

    const newErrors = validateForm(formData)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    
    setSubmittedRecipe(formData)
  }

  return (
    <div className="container">
      <h1>Recipe Submission Form</h1>

      <form className="card" onSubmit={handleSubmit}>

        <label>
          Title *
          <input name="title" value={formData.title} onChange={handleChange} />
          {errors.title && <p className="error">{errors.title}</p>}
        </label>

        <label>
          Description *
          <textarea name="description" rows={4} value={formData.description} onChange={handleChange} />
          {errors.description && <p className="error">{errors.description}</p>}
        </label>

        <label>
          Servings (1-20) *
          <input type="number" name="servings" value={formData.servings} onChange={handleChange} />
          {errors.servings && <p className="error">{errors.servings}</p>}
        </label>

        <label>
          Difficulty *
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="">Select...</option>
            {difficultyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.difficulty && <p className="error">{errors.difficulty}</p>}
        </label>

        <label>
          Category *
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select...</option>
            {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.category && <p className="error">{errors.category}</p>}
        </label>

        <label>
          Cuisine *
          <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
            <option value="">Select...</option>
            {cuisineOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {errors.cuisine && <p className="error">{errors.cuisine}</p>}
        </label>

        <label>
          Image URL (optional)
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
          {errors.imageUrl && <p className="error">{errors.imageUrl}</p>}
        </label>

        <button className="primary" type="submit">Submit Recipe</button>
      </form>

      {submittedRecipe && (
        <div className="card success">
          <h2> Submitted Recipe (Checkpoint)</h2>
          <p><strong>{submittedRecipe.title}</strong></p>
        </div>
      )}
    </div>
  )
}

export default RecipeSubmissionForm
