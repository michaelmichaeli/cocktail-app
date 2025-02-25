import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useBeforeUnload } from 'react-router-dom'
import { Plus, Trash2, AlertCircle, ArrowLeft } from 'lucide-react'
import { useCocktails } from '../hooks/useCocktails'
import { showToast } from '../lib/toast'
import { CustomCocktail } from '../types/cocktail'

export function AddCocktailPage() {
  const navigate = useNavigate()
  const { addCustomCocktail, isAddingCocktail } = useCocktails()

  const [name, setName] = useState('')
  const [instructions, setInstructions] = useState('')
  const [ingredients, setIngredients] = useState([{ name: '', measure: '' }])
  const [error, setError] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const hasUnsavedChanges = useCallback(() => {
    return name.trim() !== '' || 
           instructions.trim() !== '' || 
           ingredients.some(i => i.name.trim() !== '' || i.measure.trim() !== '')
  }, [name, instructions, ingredients])

  useEffect(() => {
    setIsDirty(hasUnsavedChanges())
  }, [name, instructions, ingredients, hasUnsavedChanges])

  useBeforeUnload(
    useCallback(
      (event) => {
        if (isDirty) {
          event.preventDefault()
          event.returnValue = ''
        }
      },
      [isDirty]
    )
  )

  const handleNavigateAway = () => {
    if (isDirty) {
      setShowDialog(true)
    } else {
      navigate('/')
    }
  }

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
      showToast('Cocktail was successfully saved!', 'success')
      navigate('/')
    } catch (err) {
      console.error(err)
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
    <>
      <dialog 
        id="unsavedChangesModal" 
        className={`modal ${showDialog ? 'modal-open' : ''}`}
        onClose={() => setShowDialog(false)}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Unsaved Changes</h3>
          <p className="py-4">You have unsaved changes. Are you sure you want to leave?</p>
          <div className="modal-action">
            <button 
              className="btn btn-ghost mr-2" 
              onClick={() => setShowDialog(false)}
            >
              Continue Editing
            </button>
            <button 
              className="btn btn-error" 
              onClick={() => {
                setShowDialog(false)
                navigate('/')
              }}
            >
              Discard Changes
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setShowDialog(false)}>close</button>
        </form>
      </dialog>

      <div className="container max-w-2xl mx-auto p-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-2xl">Add New Cocktail</h2>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleNavigateAway}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="alert alert-error">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="form-control">
                  <label className="label" htmlFor="name">
                    <span className="label-text">Name</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input input-bordered w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Ingredients</span>
                  </label>
                  <div className="space-y-3">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Ingredient"
                          className="input input-bordered flex-1"
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Amount"
                          className="input input-bordered w-32"
                          value={ingredient.measure}
                          onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                        />
                        {ingredients.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-square"
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost mt-2"
                    onClick={handleAddIngredient}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Ingredient
                  </button>
                </div>

                <div className="form-control">
                  <label className="label" htmlFor="instructions">
                    <span className="label-text">Instructions</span>
                  </label>
                  <textarea
                    id="instructions"
                    className="textarea textarea-bordered h-24"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className={`btn btn-primary flex-1 ${isAddingCocktail ? 'loading' : ''}`}
                    disabled={isAddingCocktail}
                  >
                    {isAddingCocktail ? 'Saving...' : 'Save Cocktail'}
                  </button>
                  <button
                    type="button"
                    className="btn flex-1"
                    onClick={handleNavigateAway}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
