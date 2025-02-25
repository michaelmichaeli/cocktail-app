import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { useCocktails } from '../hooks/useCocktails'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { useToast } from '../components/ui/use-toast'
import { CustomCocktail } from '../types/cocktail'

export function AddCocktailPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
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
      toast({
        title: "Success",
        description: "Cocktail was successfully saved!",
      })
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
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Cocktail</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Ingredients</Label>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      placeholder="Ingredient"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Amount"
                      value={ingredient.measure}
                      onChange={(e) => handleIngredientChange(index, 'measure', e.target.value)}
                      className="w-32"
                    />
                    {ingredients.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddIngredient}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={isAddingCocktail}
              >
                {isAddingCocktail ? 'Saving...' : 'Save Cocktail'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
