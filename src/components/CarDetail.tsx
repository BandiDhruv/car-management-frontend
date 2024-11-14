import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Car = {
  id: string
  title: string
  description: string
  images: string[]
  tags: string[]
}

export default function CarDetail() {
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

  const handleDelete = async () => {
    const token = localStorage.getItem('token')
    try {
      await axios.delete(`http://localhost:5000/api/cars/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      navigate('/cars')
    } catch (error) {
      console.error('Error deleting car:', error)
    }
  }

  if (!car) return <div>Loading...</div>

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{car.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{car.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {car.images.map((image, index) => (
            <img key={index} src={image} alt={`Car ${index + 1}`} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
        <div className="mb-4">
          {car.tags.map(tag => (
            <span key={tag} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex justify-between">
          <Button asChild>
            <Link to={`/cars/${id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </CardContent>
    </Card>
  )
}