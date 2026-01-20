import { useState } from "react"
import "./RecipeSubmissionForm.css"

const difficultyOptions = ["Easy", "Medium", "Hard"]
const categoryOptions = ["Appetizer", "Main Course", "Dessert", "Side Dish", "Beverage"]
const cuisineOptions = ["American", "Italian", "Mexican", "Asian", "Mediterranean", "Other"]
const unitOptions = ["cups", "tablespoons", "teaspoons", "ounces", "pounds", "grams", "pieces"]

const createIngredient = () => ({ name: "", quantity: "", unit: "" })

const RecipeSubmissionForm = () => {

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    servings: "",
    difficulty: "",
    category: "",
    cuisine: "",
    imageUrl: "",
    ingredients: [createIngredient()],
    instructions: [""], //  NEW
  })

  const [errors, setErrors] = useState({})
  const [submittedRecipe, setSubmittedRecipe] = useState(null)


  // Core field handler

  const handleChange = event => {
    const { name, value } = event.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  // Ingredients handlers

  const handleIngredientChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.ingredients]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, ingredients: updated }
    })
  }

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, createIngredient()]
    }))
  }

  const removeIngredient = index => {
    setFormData(prev => {
      if (prev.ingredients.length === 1) return prev
      return { ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }
    })
  }


  //  Instructions handlers

  const handleInstructionChange = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.instructions]
      updated[index] = value
      return { ...prev, instructions: updated }
    })
  }

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }))
  }

  const removeInstruction = index => {
    setFormData(prev => {
      if (prev.instructions.length === 1) return prev
      return { ...prev, instructions: prev.instructions.filter((_, i) => i !== index) }
    })
  }


  // Validation

  const validateForm = data => {
    const newErrors = {}

    // Core validations
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
      try { new URL(data.imageUrl) } catch { newErrors.imageUrl = "Please enter a valid URL" }
    }

    //  Ingredient validations (per row)
    data.ingredients.forEach((ing, index) => {
      if (!ing.name.trim() || ing.name.trim().length < 2) {
        newErrors[`ingredientName-${index}`] = "Ingredient name must be at least 2 characters"
      }

      const qty = Number(ing.quantity)
      if (!ing.quantity) newErrors[`ingredientQty-${index}`] = "Quantity is required"
      else if (Number.isNaN(qty) || qty < 0.1 || qty > 1000) {
        newErrors[`ingredientQty-${index}`] = "Quantity must be between 0.1 and 1000"
      }

      if (!ing.unit) newErrors[`ingredientUnit-${index}`] = "Unit is required"
    })

    //  Instructions validations (per step)
    data.instructions.forEach((step, index) => {
      if (!step.trim() || step.trim().length < 5) {
        newErrors[`instruction-${index}`] = "Instruction must be at least 5 characters"
      }
    })

    return newErrors
  }


  // Submit

  const handleSubmit = event => {
    event.preventDefault()

    const newErrors = validateForm(formData)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    //  : Show submitted recipe summary
    setSubmittedRecipe(formData)

    //  : Reset form after success
    setFormData({
      title: "",
      description: "",
      servings: "",
      difficulty: "",
      category: "",
      cuisine: "",
      imageUrl: "",
      ingredients: [createIngredient()],
      instructions: [""],
    })

    setErrors({})
  }

  return (
    <div className="container">
      <h1>Recipe Submission Form</h1>

      <form className="card" onSubmit={handleSubmit}>

        {/* Core Fields */}
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

        <hr />

        {/* Ingredients */}
        <div className="sectionHeader">
          <h2>Ingredients *</h2>
          <button type="button" className="secondary" onClick={addIngredient}>+ Add</button>
        </div>

        {formData.ingredients.map((ing, index) => (
          <div className="row" key={index}>
            <div>
              <input
                placeholder="Name"
                value={ing.name}
                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
              />
              {errors[`ingredientName-${index}`] && <p className="error">{errors[`ingredientName-${index}`]}</p>}
            </div>

            <div>
              <input
                type="number"
                step="0.1"
                placeholder="Qty"
                value={ing.quantity}
                onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
              />
              {errors[`ingredientQty-${index}`] && <p className="error">{errors[`ingredientQty-${index}`]}</p>}
            </div>

            <div>
              <select
                value={ing.unit}
                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
              >
                <option value="">Unit</option>
                {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              {errors[`ingredientUnit-${index}`] && <p className="error">{errors[`ingredientUnit-${index}`]}</p>}
            </div>

            <button
              type="button"
              className="danger"
              onClick={() => removeIngredient(index)}
              disabled={formData.ingredients.length === 1}
            >
              Remove
            </button>
          </div>
        ))}

        <hr />

        {/*  Instructions */}
        <div className="sectionHeader">
          <h2>Instructions *</h2>
          <button type="button" className="secondary" onClick={addInstruction}>+ Add</button>
        </div>

        {formData.instructions.map((step, index) => (
          <div className="instruction" key={index}>
            <textarea
              rows={3}
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleInstructionChange(index, e.target.value)}
            />
            {errors[`instruction-${index}`] && <p className="error">{errors[`instruction-${index}`]}</p>}

            <button
              type="button"
              className="danger"
              onClick={() => removeInstruction(index)}
              disabled={formData.instructions.length === 1}
            >
              Remove Step
            </button>
          </div>
        ))}

        <button className="primary" type="submit">Submit Recipe</button>
      </form>

      {/*  Full Recipe Summary Card */}
      {submittedRecipe && (
        <div className="card success">
          <h2> Recipe Submitted!</h2>

          <h3>{submittedRecipe.title}</h3>
          <p><strong>Servings:</strong> {submittedRecipe.servings}</p>
          <p><strong>Difficulty:</strong> {submittedRecipe.difficulty}</p>
          <p><strong>Category:</strong> {submittedRecipe.category}</p>
          <p><strong>Cuisine:</strong> {submittedRecipe.cuisine}</p>
          <p>{submittedRecipe.description}</p>

          {submittedRecipe.imageUrl && (
            <img className="img" src={submittedRecipe.imageUrl} alt={submittedRecipe.title} />
          )}

          <h3>Ingredients</h3>
          <ul>
            {submittedRecipe.ingredients.map((ing, i) => (
              <li key={i}>
                {ing.quantity} {ing.unit} — {ing.name}
              </li>
            ))}
          </ul>

          <h3>Instructions</h3>
          <ol>
            {submittedRecipe.instructions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default RecipeSubmissionForm
