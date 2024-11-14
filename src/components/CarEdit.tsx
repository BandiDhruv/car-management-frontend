import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Car = {
  id: string
  title: string
  description: string
  images: string[]
  tags: string[]
}

export default function CarEdit() {
  const [car, setCar] = useState<Car | null>(null)
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCar = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await axios.get(`http://localhost:5000/api/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCar(response.data)
      } catch (error) {
        console.error('Error fetching car details:', error)
      }
    }

    fetchCar()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.put(`http://localhost:5000/api/cars/${id}`, car, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate(`/cars/${id}`)
    } catch (error) {
      console.error('Error updating car:', error)
    }
  }

  if (!car) return <div>Loading...</div>

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Car</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Title"
              value={car.title}
              onChange={(e) => setCar({ ...car, title: e.target.value })}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Tags (comma-separated)"
              value={car.tags.join(', ')}
              onChange={(e) => setCar({ ...car, tags: e.target.value.split(',').map(tag => tag.trim()) })}
            />
          </div>
          {/* Add image upload functionality here */}
          <Button type="submit">Update Car</Button>
        </form>
      </CardContent>
    </Card>
  )
}