import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCocktails } from '../hooks/useCocktails'
import { CustomCocktail } from '../types/cocktail'

export function AddCocktailPage() {
  const navigate = useNavigate()
  const { addCustomCocktail, isAddingCocktail } = useCocktails()

  const [name, setName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [ingredients, setIngredients] = useState([{ name: '', measure: '' }])
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !instructions.trim()) {
      setError('Name and instructions are required')
      return
    }

    const validIngredients = ingredients.filter(i => i.name.trim())
    if (validIngredients.length === 0) {
      setError('At least one ingredient is required')
      return
    }

    const newCocktail: Omit<CustomCocktail, 'id'> = {
      name: name.trim(),
      instructions: instructions.trim(),
      ingredients: validIngredients
    }

    try {
      await addCustomCocktail(newCocktail)
      navigate('/')
    } catch (err) {
      setError('Failed to save cocktail')
    }
  }

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', measure: '' }])
  }

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleIngredientChange = (
    index: number,
    field: 'name' | 'measure',
    value: string
  ) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = { ...newIngredients[index], [field]: value }
    setIngredients(newIngredients)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Cocktail</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredients</label>
          <div className="space-y-3 mt-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ingredient"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Amount"
                  value={ingredient.measure}
                  onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                  className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="px-2 py-1 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Add Ingredient
          </button>
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
            Instructions
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isAddingCocktail}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isAddingCocktail ? 'Saving...' : 'Save Cocktail'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
