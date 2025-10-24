import React, { useState } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./components/ui/alert-dialog";
import { Calendar, ChefHat, Home, Package, Settings, User, Plus, Search, Edit, Trash2, Heart, Clock, Users, AlertTriangle, CheckCircle, X, Star, ShoppingCart, BookOpen, Download } from 'lucide-react';
import { ImageWithFallback } from './assets/ImageWithFallback';
import smartRoutineLogo from './assets/logo.png';

// Mock data
const mockFoodItems = [
  { id: 1, name: 'Leite', quantity: 1, unit: 'L', expirationDate: '2024-12-26', category: 'Laticínios', daysUntilExpiry: 2 },
  { id: 2, name: 'Pão', quantity: 1, unit: 'unidade', expirationDate: '2024-12-27', category: 'Padaria', daysUntilExpiry: 3 },
  { id: 3, name: 'Cenouras', quantity: 1, unit: 'kg', expirationDate: '2024-12-30', category: 'Vegetais', daysUntilExpiry: 6 },
  { id: 4, name: 'Peito de Frango', quantity: 500, unit: 'g', expirationDate: '2024-12-25', category: 'Carnes', daysUntilExpiry: 1 },
  { id: 5, name: 'Iogurte', quantity: 4, unit: 'unidade', expirationDate: '2024-12-28', category: 'Laticínios', daysUntilExpiry: 4 },
];

const mockRecipes = [
  { 
    id: 1, 
    name: 'Refogado de Frango', 
    time: '25 min', 
    image: 'https://plus.unsplash.com/premium_photo-1661767136966-38d5999f819a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ingredients: ['Peito de Frango', 'Cenouras', 'Molho de Soja', 'Alho'],
    steps: ['Corte o frango em tiras', 'Aqueça o óleo na panela', 'Cozinhe o frango até dourar', 'Adicione os vegetais', 'Refogue por 5 minutos', 'Tempere e sirva'],
    isFavorite: false
  },
  { 
    id: 2, 
    name: 'Parfait de Iogurte Cremoso', 
    time: '10 min', 
    image: 'https://plus.unsplash.com/premium_photo-1713719216015-00a348bc4526?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ingredients: ['Iogurte', 'Frutas Vermelhas', 'Granola', 'Mel'],
    steps: ['Coloque o iogurte em um copo', 'Adicione as frutas', 'Polvilhe a granola', 'Regue com mel', 'Repita as camadas', 'Sirva gelado'],
    isFavorite: true
  },
];

type User = {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
};

type Page = 'home' | 'login' | 'signup' | 'dashboard' | 'pantry' | 'recipes' | 'profile';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [foodItems, setFoodItems] = useState(mockFoodItems);
  const [recipes, setRecipes] = useState(mockRecipes);
  const [formData, setFormData] = useState({});
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [newRecipeIngredients, setNewRecipeIngredients] = useState(['']);
  const [newRecipeInstructions, setNewRecipeInstructions] = useState(['']);
  const [isEditFoodOpen, setIsEditFoodOpen] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [recipeModalStep, setRecipeModalStep] = useState<'choice' | 'manual' | 'ai'>('choice');
  const [aiRecipeOption, setAiRecipeOption] = useState<'pantry-only' | 'pantry-based' | 'custom' | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  // Navigation
  const navigate = (page: Page) => {
    setCurrentPage(page);
    setError('');
    setSuccess('');
  };

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    if (email && password) {
      setUser({ id: '1', name: 'João Silva', email, dateOfBirth: '1990-01-01' });
      navigate('dashboard');
      setSuccess('Bem-vindo de volta!');
    } else {
      setError('Por favor, insira email e senha');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const terms = formData.get('terms');
    
    if (name && email && password && dateOfBirth && terms) {
      setUser({ id: '1', name, email, dateOfBirth });
      navigate('dashboard');
      setSuccess('Conta criada com sucesso!');
    } else {
      setError('Por favor, preencha todos os campos e aceite os termos');
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate('home');
  };

  // Food management
  const addFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newItem = {
      id: Date.now(),
      name: formData.get('name') as string,
      quantity: parseFloat(formData.get('quantity') as string),
      unit: formData.get('unit') as string,
      expirationDate: formData.get('expirationDate') as string,
      category: formData.get('category') as string,
      daysUntilExpiry: Math.ceil((new Date(formData.get('expirationDate') as string).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    };
    setFoodItems([...foodItems, newItem]);
    setIsAddFoodOpen(false);
    setSuccess('Alimento adicionado com sucesso!');
  };

  const deleteFoodItem = (id: number) => {
    setFoodItems(foodItems.filter(item => item.id !== id));
    setSuccess('Alimento removido com sucesso!');
  };

  const editFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedItem = {
      ...editingFood,
      name: formData.get('name') as string,
      quantity: parseFloat(formData.get('quantity') as string),
      unit: formData.get('unit') as string,
      expirationDate: formData.get('expirationDate') as string,
      category: formData.get('category') as string,
      daysUntilExpiry: Math.ceil((new Date(formData.get('expirationDate') as string).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    };
    setFoodItems(foodItems.map(item => item.id === editingFood.id ? updatedItem : item));
    setIsEditFoodOpen(false);
    setEditingFood(null);
    setSuccess('Alimento atualizado com sucesso!');
  };

  const openEditFood = (item) => {
    setEditingFood(item);
    setIsEditFoodOpen(true);
  };

  const downloadPantryPDF = async () => {
    const jsPDFModule = await import('jspdf');
    const jsPDF = jsPDFModule.jsPDF || jsPDFModule.default;
    const autoTableModule = await import('jspdf-autotable');
    
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.width;
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // cor primary
    doc.text('SmartRoutine', pageWidth / 2, 20, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Relatório da Despensa', pageWidth / 2, 30, { align: 'center' });
    
    // Informações do usuário e data
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Usuário: ${user.name}`, 14, 40);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 45);
    
    // Estatísticas
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo:', 14, 55);
    doc.setFontSize(10);
    doc.text(`Total de Itens: ${foodItems.length}`, 14, 62);
    doc.text(`Itens Vencendo em 3 dias: ${expiringItems.length}`, 14, 68);
    doc.text(`Itens Vencidos: ${foodItems.filter(item => item.daysUntilExpiry <= 0).length}`, 14, 74);
    
    // Tabela de alimentos
    const tableData = foodItems.map(item => [
      item.name,
      `${item.quantity} ${item.unit}`,
      item.category,
      item.expirationDate,
      item.daysUntilExpiry <= 0 ? 'Vencido' : 
        item.daysUntilExpiry <= 3 ? 'Vence Em Breve' : 'Fresco'
    ]);
    
    doc.autoTable({
      startY: 82,
      head: [['Nome', 'Quantidade', 'Categoria', 'Validade', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [16, 185, 129], // cor primary
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 35 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 35 }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Rodapé
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount} - SmartRoutine © ${new Date().getFullYear()}`,
        pageWidth / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    // Salvar PDF
    doc.save(`despensa-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`);
    setSuccess('PDF da despensa baixado com sucesso!');
  };

  const toggleFavoriteRecipe = (id: number) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
  };

  const deleteRecipe = (id: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
    setSuccess('Receita excluída com sucesso!');
  };

  // Recipe management
  const addRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newRecipe = {
      id: Date.now(),
      name: formData.get('name') as string,
      time: formData.get('time') as string,
      image: formData.get('image') as string || 'https://images.unsplash.com/photo-1739656442968-c6b6bcb48752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHJlY2lwZXMlMjBjb29raW5nfGVufDF8fHx8MTc1ODc1ODAxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: newRecipeIngredients.filter(ingredient => ingredient.trim() !== ''),
      steps: newRecipeInstructions.filter(instruction => instruction.trim() !== ''),
      isFavorite: false
    };
    setRecipes([...recipes, newRecipe]);
    resetRecipeModal();
    setSuccess('Receita adicionada com sucesso!');
  };

  const generateAiRecipe = () => {
    // Simulação de geração de receita com IA
    let recipeName = '';
    let recipeIngredients = [];
    
    if (aiRecipeOption === 'pantry-only') {
      recipeName = 'Receita Criativa com Ingredientes da Despensa';
      recipeIngredients = foodItems.slice(0, 4).map(item => item.name);
    } else if (aiRecipeOption === 'pantry-based') {
      recipeName = 'Receita Especial Baseada na sua Despensa';
      recipeIngredients = [...foodItems.slice(0, 3).map(item => item.name), 'Azeite', 'Sal', 'Pimenta'];
    } else if (aiRecipeOption === 'custom') {
      recipeName = 'Receita Personalizada: ' + customPrompt.substring(0, 30);
      recipeIngredients = foodItems.slice(0, 3).map(item => item.name);
    }

    const newRecipe = {
      id: Date.now(),
      name: recipeName,
      time: '30 min',
      image: 'https://images.unsplash.com/photo-1739656442968-c6b6bcb48752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHJlY2lwZXMlMjBjb29raW5nfGVufDF8fHx8MTc1ODc1ODAxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      ingredients: recipeIngredients,
      steps: [
        'Prepare todos os ingredientes',
        'Siga as instruções da receita gerada',
        'Tempere a gosto',
        'Sirva quente'
      ],
      isFavorite: false
    };

    setRecipes([...recipes, newRecipe]);
    resetRecipeModal();
    setSuccess('Receita gerada com sucesso!');
  };

  const resetRecipeModal = () => {
    setIsAddRecipeOpen(false);
    setRecipeModalStep('choice');
    setAiRecipeOption(null);
    setCustomPrompt('');
    setNewRecipeIngredients(['']);
    setNewRecipeInstructions(['']);
  };

  const addIngredientField = () => {
    setNewRecipeIngredients([...newRecipeIngredients, '']);
  };

  const removeIngredientField = (index: number) => {
    const newIngredients = newRecipeIngredients.filter((_, i) => i !== index);
    setNewRecipeIngredients(newIngredients.length === 0 ? [''] : newIngredients);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...newRecipeIngredients];
    newIngredients[index] = value;
    setNewRecipeIngredients(newIngredients);
  };

  const addInstructionField = () => {
    setNewRecipeInstructions([...newRecipeInstructions, '']);
  };

  const removeInstructionField = (index: number) => {
    const newInstructions = newRecipeInstructions.filter((_, i) => i !== index);
    setNewRecipeInstructions(newInstructions.length === 0 ? [''] : newInstructions);
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...newRecipeInstructions];
    newInstructions[index] = value;
    setNewRecipeInstructions(newInstructions);
  };

  // Filter food items
  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const expiringItems = foodItems.filter(item => item.daysUntilExpiry <= 3);
  const favoriteRecipes = recipes.filter(recipe => recipe.isFavorite);

  // Home Page (Landing Page)
  if (currentPage === 'home' && !user) {
    const features = [
      {
        icon: Calendar,
        title: "Controle de Validade",
        description: "Mantenha o controle dos alimentos e suas datas de validade",
        color: "rgb(99, 102, 241)" // secondary color
      },
      {
        icon: ChefHat,
        title: "Receitas Personalizadas",
        description: "Descubra receitas baseadas nos alimentos que você tem",
        color: "rgb(245, 158, 11)" // accent color
      },
      {
        icon: ShoppingCart,
        title: "Gestão de Estoque",
        description: "Organize sua despensa e gerencie seu estoque",
        color: "rgb(16, 185, 129)" // primary color
      },
      {
        icon: BookOpen,
        title: "Biblioteca de Receitas",
        description: "Acesse centenas de receitas categorizadas",
        color: "rgb(99, 102, 241)" // secondary color
      }
    ];

    const testimonials = [
      {
        name: "Maria Silva",
        role: "Chef de Cozinha",
        content: "O SmartRoutine revolucionou como organizo minha cozinha. Nunca mais desperdicei alimentos!",
        rating: 5
      },
      {
        name: "João Santos",
        role: "Pai de Família",
        content: "Fantástico para quem tem família grande. As receitas sugeridas são sempre certeiras.",
        rating: 5
      },
      {
        name: "Ana Costa",
        role: "Estudante",
        content: "Perfeito para quem vive sozinho. Me ajuda a economizar e comer melhor.",
        rating: 4
      }
    ];

    return (
      <div className="min-h-screen">
        {/* Header Navigation */}
        <nav className="bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img src={smartRoutineLogo} alt="SmartRoutine" className="w-8 h-8" />
                </div>
                <span className="font-semibold">SmartRoutine</span>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('login')}>
                  Entrar
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => navigate('signup')}>
                  Criar Conta
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-5 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl leading-tight">
                  Gerencie seus{" "}
                  <span className="text-primary">alimentos</span>{" "}
                  e descubra{" "}
                  <span className="text-secondary">receitas</span>{" "}
                  incríveis
                </h1>
                <p className="text-xl text-muted-foreground">
                  Organize sua despensa, controle validades e encontre as melhores receitas 
                  baseadas nos ingredientes que você tem em casa.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
                  onClick={() => navigate('signup')}
                >
                  Começar Agora
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Ver Demonstração
                </Button>
              </div>              
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1605291535065-e1d52d2b264a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Cozinha moderna com alimentos saudáveis"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p>Receita Favorita</p>
                    <p className="text-sm text-muted-foreground">Salada Caesar</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/30 py-16">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl">Principais Recursos</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Tudo o que você precisa para uma cozinha organizada e receitas deliciosas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center mb-4" 
                      style={{ backgroundColor: feature.color }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-5">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl">O que nossos usuários dizem</h2>
              <p className="text-xl text-muted-foreground">
                Depoimentos reais de pessoas que transformaram sua rotina culinária
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p>{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-5 text-center">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl text-primary-foreground">
                Pronto para transformar sua cozinha?
              </h2>
              <p className="text-xl text-primary-foreground/90">
                Junte-se a milhares de usuários que já descobriram uma nova forma de cozinhar
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('signup')}
                >
                  Criar Conta Gratuita
                </Button>
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="text-lg px-8 py-6 text-primary bg-primary-foreground border-primary hover:bg-primary-foreground hover:text-primary"
                  onClick={() => navigate('login')}
                >
                  Já Tenho Conta
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="max-w-7xl mx-auto px-5 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-8 flex items-center justify-center">
                <img src={smartRoutineLogo} alt="SmartRoutine" className="w-8 h-8" />
              </div>
              <span className="font-semibold">SmartRoutine</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SmartRoutine. Todos os direitos reservados. Transforme sua forma de cozinhar.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Login Page
  if (currentPage === 'login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 flex items-center justify-center">
              <img src={smartRoutineLogo} alt="SmartRoutine" className="w-16 h-16" />
            </div>
            <div>
              <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
              <CardDescription>Entre em sua conta SmartRoutine</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                  <AlertTriangle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="joao@exemplo.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Entrar
              </Button>
              <div className="text-center space-y-2">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Esqueceu a senha?
                </Button>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    Não tem uma conta?{' '}
                    <Button variant="link" onClick={() => navigate('signup')} className="p-0 h-auto text-primary">
                      Criar conta
                    </Button>
                  </p>
                  <p>
                    <Button variant="link" onClick={() => navigate('home')} className="p-0 h-auto text-muted-foreground">
                      ← Voltar ao início
                    </Button>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sign Up Page
  if (currentPage === 'signup') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 flex items-center justify-center">
              <img src={smartRoutineLogo} alt="SmartRoutine" className="w-16 h-16" />
            </div>
            <div>
              <CardTitle className="text-2xl">Crie sua conta</CardTitle>
              <CardDescription>Junte-se ao SmartRoutine para gerenciar seu estoque de alimentos</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                  <AlertTriangle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" name="name" placeholder="João Silva" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="joao@exemplo.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" name="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  Eu concordo com os Termos e Política de Privacidade
                </Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Criar Conta
              </Button>
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p>
                  Já tem uma conta?{' '}
                  <Button variant="link" onClick={() => navigate('login')} className="p-0 h-auto text-primary">
                    Entrar
                  </Button>
                </p>
                <p>
                  <Button variant="link" onClick={() => navigate('home')} className="p-0 h-auto text-muted-foreground">
                    ← Voltar ao início
                  </Button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={smartRoutineLogo} alt="SmartRoutine" className="w-8 h-8" />
            </div>
            <span className="font-semibold">SmartRoutine</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2"
            >
              <Home size={16} />
              Painel
            </Button>
            <Button
              variant={currentPage === 'pantry' ? 'default' : 'ghost'}
              onClick={() => navigate('pantry')}
              className="flex items-center gap-2"
            >
              <Package size={16} />
              Despensa
            </Button>
            <Button
              variant={currentPage === 'recipes' ? 'default' : 'ghost'}
              onClick={() => navigate('recipes')}
              className="flex items-center gap-2"
            >
              <ChefHat size={16} />
              Receitas
            </Button>
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              onClick={() => navigate('profile')}
              className="flex items-center gap-2"
            >
              <Settings size={16} />
              Perfil
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );

  // Dashboard Page
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto p-5 space-y-6">
          {success && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-md text-primary">
              <CheckCircle size={16} />
              <span className="text-sm">{success}</span>
              <Button variant="ghost" size="sm" onClick={() => setSuccess('')} className="ml-auto p-1 h-auto">
                <X size={14} />
              </Button>
            </div>
          )}
          
          <div className="space-y-2">
            <h1>Bem-vindo de volta, {user.name}!</h1>
            <p className="text-muted-foreground">Aqui está o que está acontecendo com seu estoque de alimentos hoje.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alimentos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{foodItems.length}</div>
                <p className="text-xs text-muted-foreground">Itens na despensa</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vencendo Em Breve</CardTitle>
                <AlertTriangle className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{expiringItems.length}</div>
                <p className="text-xs text-muted-foreground">Itens vencem em 3 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receitas Favoritas</CardTitle>
                <Heart className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{favoriteRecipes.length}</div>
                <p className="text-xs text-muted-foreground">Receitas salvas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sugestões de Receitas</CardTitle>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipes.length}</div>
                <p className="text-xs text-muted-foreground">Receitas disponíveis</p>
              </CardContent>
            </Card>
          </div>

          {expiringItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  Itens Vencendo Em Breve
                </CardTitle>
                <CardDescription>Estes itens irão vencer dentro de 3 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {expiringItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-accent/10 border border-accent/20 rounded-md">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} {item.unit} • Vence em {item.expirationDate}</p>
                      </div>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        {item.daysUntilExpiry} dia{item.daysUntilExpiry !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Gerencie seu estoque de alimentos e receitas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => navigate('pantry')} className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Ver Despensa
                </Button>
                <Button onClick={() => navigate('recipes')} className="w-full justify-start" variant="outline">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Explorar Receitas
                </Button>
                <Button onClick={() => navigate('profile')} className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receitas Recentes</CardTitle>
                <CardDescription>Sugestões baseadas em sua despensa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipes.slice(0, 3).map((recipe) => (
                    <div key={recipe.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded-md cursor-pointer">
                      <ImageWithFallback 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{recipe.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {recipe.time}
                        </p>
                      </div>
                      {recipe.isFavorite && <Heart size={16} className="text-destructive fill-current" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Pantry Page
  if (currentPage === 'pantry') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto p-5 space-y-6">
          {success && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-md text-primary">
              <CheckCircle size={16} />
              <span className="text-sm">{success}</span>
              <Button variant="ghost" size="sm" onClick={() => setSuccess('')} className="ml-auto p-1 h-auto">
                <X size={14} />
              </Button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div>
              <h1>Despensa de Alimentos</h1>
              <p className="text-muted-foreground">Gerencie seu estoque de alimentos e acompanhe as datas de validade</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={downloadPantryPDF}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Despensa
              </Button>
              <Dialog open={isAddFoodOpen} onOpenChange={setIsAddFoodOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Alimento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Alimento</DialogTitle>
                    <DialogDescription>Digite os detalhes do alimento que você deseja adicionar à sua despensa.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={addFoodItem} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome do Alimento</Label>
                      <Input id="name" name="name" placeholder="ex: Leite, Pão, Maçãs" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input 
                          id="quantity" 
                          name="quantity" 
                          type="number" 
                          step="0.01"
                          min="0.01"
                          placeholder="ex: 1, 500, 2.5" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unidade</Label>
                        <Select name="unit" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="unidade">unidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoria</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laticínios">Laticínios</SelectItem>
                          <SelectItem value="Carnes">Carnes</SelectItem>
                          <SelectItem value="Vegetais">Vegetais</SelectItem>
                          <SelectItem value="Frutas">Frutas</SelectItem>
                          <SelectItem value="Padaria">Padaria</SelectItem>
                          <SelectItem value="Despensa">Despensa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expirationDate">Data de Validade</Label>
                      <Input id="expirationDate" name="expirationDate" type="date" required />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsAddFoodOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Adicionar Alimento
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Modal de Edição de Alimento */}
            <Dialog open={isEditFoodOpen} onOpenChange={setIsEditFoodOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Alimento</DialogTitle>
                  <DialogDescription>Atualize os detalhes do alimento selecionado.</DialogDescription>
                </DialogHeader>
                {editingFood && (
                  <form onSubmit={editFoodItem} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Nome do Alimento</Label>
                      <Input 
                        id="edit-name" 
                        name="name" 
                        placeholder="ex: Leite, Pão, Maçãs" 
                        defaultValue={editingFood.name}
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-quantity">Quantidade</Label>
                        <Input 
                          id="edit-quantity" 
                          name="quantity" 
                          type="number" 
                          step="0.01"
                          min="0.01"
                          placeholder="ex: 1, 500, 2.5" 
                          defaultValue={editingFood.quantity}
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-unit">Unidade</Label>
                        <Select name="unit" defaultValue={editingFood.unit} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="g">g</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="ml">ml</SelectItem>
                            <SelectItem value="unidade">unidade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-category">Categoria</Label>
                      <Select name="category" defaultValue={editingFood.category} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Laticínios">Laticínios</SelectItem>
                          <SelectItem value="Carnes">Carnes</SelectItem>
                          <SelectItem value="Vegetais">Vegetais</SelectItem>
                          <SelectItem value="Frutas">Frutas</SelectItem>
                          <SelectItem value="Padaria">Padaria</SelectItem>
                          <SelectItem value="Despensa">Despensa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-expirationDate">Data de Validade</Label>
                      <Input 
                        id="edit-expirationDate" 
                        name="expirationDate" 
                        type="date" 
                        defaultValue={editingFood.expirationDate}
                        required 
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsEditFoodOpen(false);
                          setEditingFood(null);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Salvar Alterações
                      </Button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>


          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="laticínios">Laticínios</SelectItem>
                <SelectItem value="carnes">Carnes</SelectItem>
                <SelectItem value="vegetais">Vegetais</SelectItem>
                <SelectItem value="frutas">Frutas</SelectItem>
                <SelectItem value="padaria">Padaria</SelectItem>
                <SelectItem value="despensa">Despensa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredFoodItems.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1705948729112-3139fdf1a443?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMHBsYXRlJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1ODc1ODAyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Despensa vazia"
                  className="w-32 h-32 mx-auto mb-4 rounded-full object-cover opacity-50"
                />
                <h3 className="text-lg font-medium mb-2">Nenhum alimento encontrado</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filterCategory !== 'all' 
                    ? "Tente ajustar sua busca ou filtro para encontrar itens." 
                    : "Comece adicionando alguns alimentos à sua despensa."}
                </p>
                <Button onClick={() => setIsAddFoodOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Seu Primeiro Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data de Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFoodItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity} {item.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.expirationDate}</TableCell>
                      <TableCell>
                        {item.daysUntilExpiry <= 0 ? (
                          <Badge variant="destructive">Vencido</Badge>
                        ) : item.daysUntilExpiry <= 3 ? (
                          <Badge className="bg-accent text-accent-foreground">Vence Em Breve</Badge>
                        ) : (
                          <Badge variant="secondary">Fresco</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => openEditFood(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Alimento</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza de que deseja excluir "{item.name}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteFoodItem(item.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Recipes Page
  if (currentPage === 'recipes') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto p-5 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1>Sugestões de Receitas</h1>
              <p className="text-muted-foreground">Descubra receitas baseadas em seus ingredientes disponíveis</p>
            </div>
            <Dialog open={isAddRecipeOpen} onOpenChange={(open) => {
              setIsAddRecipeOpen(open);
              if (!open) resetRecipeModal();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Receita
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                {recipeModalStep === 'choice' && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Como deseja adicionar sua receita?</DialogTitle>
                      <DialogDescription>Escolha entre criar manualmente ou gerar com IA</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6">
                      <Card 
                        className="cursor-pointer hover:border-primary hover:shadow-md transition-all p-6"
                        onClick={() => setRecipeModalStep('manual')}
                      >
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                            <Edit className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Adicionar Receita</h3>
                            <p className="text-sm text-muted-foreground">
                              Preencha os detalhes da receita manualmente
                            </p>
                          </div>
                        </div>
                      </Card>
                      
                      <Card 
                        className="cursor-pointer hover:border-secondary hover:shadow-md transition-all p-6"
                        onClick={() => setRecipeModalStep('ai')}
                      >
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                            <ChefHat className="w-8 h-8 text-secondary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Gerar Receita com IA</h3>
                            <p className="text-sm text-muted-foreground">
                              Deixe a IA criar uma receita para você
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </>
                )}

                {recipeModalStep === 'ai' && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Gerar Receita com IA</DialogTitle>
                      <DialogDescription>Escolha como deseja gerar sua receita</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          aiRecipeOption === 'pantry-only' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setAiRecipeOption('pantry-only')}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            aiRecipeOption === 'pantry-only' ? 'border-primary' : 'border-border'
                          }`}>
                            {aiRecipeOption === 'pantry-only' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">Gerar receita somente com os alimentos da despensa</h4>
                            <p className="text-sm text-muted-foreground">
                              A IA criará uma receita usando apenas os ingredientes disponíveis na sua despensa
                            </p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          aiRecipeOption === 'pantry-based' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setAiRecipeOption('pantry-based')}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            aiRecipeOption === 'pantry-based' ? 'border-primary' : 'border-border'
                          }`}>
                            {aiRecipeOption === 'pantry-based' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">Gerar receita utilizando os alimentos da despensa</h4>
                            <p className="text-sm text-muted-foreground">
                              A IA criará uma receita baseada nos seus ingredientes, mas pode incluir outros itens comuns
                            </p>
                          </div>
                        </div>
                      </div>

                      <div 
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          aiRecipeOption === 'custom' 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setAiRecipeOption('custom')}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            aiRecipeOption === 'custom' ? 'border-primary' : 'border-border'
                          }`}>
                            {aiRecipeOption === 'custom' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">Prompt personalizado</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Descreva o tipo de receita que você deseja
                            </p>
                            {aiRecipeOption === 'custom' && (
                              <Textarea
                                placeholder="Ex: Uma receita vegetariana rápida para o jantar..."
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                rows={3}
                                className="mt-2"
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 pt-4 border-t">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setRecipeModalStep('choice');
                          setAiRecipeOption(null);
                          setCustomPrompt('');
                        }}
                      >
                        Voltar
                      </Button>
                      <Button 
                        type="button"
                        className="bg-secondary hover:bg-secondary/90"
                        disabled={!aiRecipeOption || (aiRecipeOption === 'custom' && !customPrompt.trim())}
                        onClick={generateAiRecipe}
                      >
                        <ChefHat className="mr-2 h-4 w-4" />
                        Gerar Receita
                      </Button>
                    </div>
                  </>
                )}

                {recipeModalStep === 'manual' && (
                  <>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Receita</DialogTitle>
                      <DialogDescription>Crie uma nova receita para adicionar à sua coleção.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={addRecipe} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipeName">Nome da Receita</Label>
                      <Input id="recipeName" name="name" placeholder="ex: Refogado de Frango" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipeTime">Tempo de Preparo</Label>
                      <Input id="recipeTime" name="time" placeholder="ex: 30 min" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipeImage">URL da Imagem da Receita</Label>
                      <Input id="recipeImage" name="image" type="url" placeholder="https://exemplo.com/imagem.jpg" />
                      <p className="text-xs text-muted-foreground">Opcional: Adicione uma URL para a imagem da receita</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipeServings">Serve (pessoas)</Label>
                      <Select name="servings" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar porções" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 pessoas</SelectItem>
                          <SelectItem value="2-4">2-4 pessoas</SelectItem>
                          <SelectItem value="4-6">4-6 pessoas</SelectItem>
                          <SelectItem value="6+">6+ pessoas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Ingredientes</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addIngredientField}>
                        <Plus className="mr-1 h-3 w-3" />
                        Adicionar Ingrediente
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {newRecipeIngredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Ingrediente ${index + 1}`}
                            value={ingredient}
                            onChange={(e) => updateIngredient(index, e.target.value)}
                            required={index === 0}
                          />
                          {newRecipeIngredients.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeIngredientField(index)}
                              className="px-2"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Instruções</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addInstructionField}>
                        <Plus className="mr-1 h-3 w-3" />
                        Adicionar Passo
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {newRecipeInstructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">Passo {index + 1}</Label>
                            <Textarea
                              placeholder={`Descreva o passo ${index + 1}...`}
                              value={instruction}
                              onChange={(e) => updateInstruction(index, e.target.value)}
                              required={index === 0}
                              rows={2}
                            />
                          </div>
                          {newRecipeInstructions.length > 1 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeInstructionField(index)}
                              className="px-2 mt-5"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                      <div className="flex justify-between gap-2 pt-4 border-t">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setRecipeModalStep('choice');
                            setNewRecipeIngredients(['']);
                            setNewRecipeInstructions(['']);
                          }}
                        >
                          Voltar
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                          Adicionar Receita
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="suggestions">Sugestões de Receitas</TabsTrigger>
              <TabsTrigger value="favorites">Minhas Favoritas ({favoriteRecipes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar receitas..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tempo de preparo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tempos</SelectItem>
                    <SelectItem value="quick">Menos de 15 min</SelectItem>
                    <SelectItem value="medium">15-30 min</SelectItem>
                    <SelectItem value="long">30+ min</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <ImageWithFallback 
                        src={recipe.image} 
                        alt={recipe.name}
                        className="w-full h-48 object-cover"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                        onClick={() => toggleFavoriteRecipe(recipe.id)}
                      >
                        <Heart 
                          size={16} 
                          className={recipe.isFavorite ? 'text-destructive fill-current' : 'text-muted-foreground'} 
                        />
                      </Button>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{recipe.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {recipe.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          2-4 porções
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-2">Ingredientes Disponíveis:</p>
                          <div className="flex flex-wrap gap-1">
                            {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {ingredient}
                              </Badge>
                            ))}
                            {recipe.ingredients.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{recipe.ingredients.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full" variant="outline">
                              Ver Detalhes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{recipe.name}</DialogTitle>
                              <DialogDescription className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {recipe.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users size={14} />
                                  2-4 porções
                                </span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <ImageWithFallback 
                                src={recipe.image} 
                                alt={recipe.name}
                                className="w-full h-64 object-cover rounded-md"
                              />
                              <div>
                                <h4 className="font-medium mb-2">Ingredientes:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Instruções:</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm">
                                  {recipe.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                              <div className="flex gap-2 pt-4 border-t">
                                <Button 
                                  onClick={() => toggleFavoriteRecipe(recipe.id)}
                                  className={`flex-1 ${recipe.isFavorite ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                                >
                                  <Heart size={16} className={recipe.isFavorite ? 'mr-2 fill-current' : 'mr-2'} />
                                  {recipe.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="text-destructive hover:text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Receita</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza de que deseja excluir "{recipe.name}"? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => deleteRecipe(recipe.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              {favoriteRecipes.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Nenhuma receita favorita ainda</h3>
                    <p className="text-muted-foreground mb-4">
                      Comece adicionando receitas aos seus favoritos para vê-las aqui.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteRecipes.map((recipe) => (
                    <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <ImageWithFallback 
                          src={recipe.image} 
                          alt={recipe.name}
                          className="w-full h-48 object-cover"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                          onClick={() => toggleFavoriteRecipe(recipe.id)}
                        >
                          <Heart size={16} className="text-destructive fill-current" />
                        </Button>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg">{recipe.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {recipe.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            2-4 porções
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full" variant="outline">
                              Ver Receita
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{recipe.name}</DialogTitle>
                              <DialogDescription className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {recipe.time}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users size={14} />
                                  2-4 porções
                                </span>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <ImageWithFallback 
                                src={recipe.image} 
                                alt={recipe.name}
                                className="w-full h-64 object-cover rounded-md"
                              />
                              <div>
                                <h4 className="font-medium mb-2">Ingredientes:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Instruções:</h4>
                                <ol className="list-decimal list-inside space-y-1 text-sm">
                                  {recipe.steps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                              <div className="flex gap-2 pt-4 border-t">
                                <Button 
                                  onClick={() => toggleFavoriteRecipe(recipe.id)}
                                  className={`flex-1 ${recipe.isFavorite ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
                                >
                                  <Heart size={16} className={recipe.isFavorite ? 'mr-2 fill-current' : 'mr-2'} />
                                  {recipe.isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="text-destructive hover:text-destructive">
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Excluir
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Excluir Receita</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza de que deseja excluir "{recipe.name}"? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => deleteRecipe(recipe.id)}
                                        className="bg-destructive hover:bg-destructive/90"
                                      >
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Profile Page
  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto p-5 space-y-6">
          {success && (
            <div className="flex items-center gap-2 p-3 bg-primary/10 border border-primary/20 rounded-md text-primary">
              <CheckCircle size={16} />
              <span className="text-sm">{success}</span>
              <Button variant="ghost" size="sm" onClick={() => setSuccess('')} className="ml-auto p-1 h-auto">
                <X size={14} />
              </Button>
            </div>
          )}

          <div>
            <h1>Configurações do Perfil</h1>
            <p className="text-muted-foreground">Gerencie as informações da sua conta e preferências</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize os detalhes do seu perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Alterar Foto
                  </Button>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Primeiro Nome</Label>
                    <Input id="firstName" defaultValue={user.name.split(' ')[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" defaultValue={user.name.split(' ').slice(1).join(' ')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <Input id="dateOfBirth" type="date" defaultValue={user.dateOfBirth} />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-start">
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>Personalize sua experiência no SmartRoutine</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Receber alertas de validade por email</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Sugestões de Receitas</Label>
                  <p className="text-sm text-muted-foreground">Receber recomendações personalizadas de receitas</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis e destrutivas</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Excluir Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Conta</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita e irá permanentemente deletar todos os seus dados incluindo alimentos, receitas e preferências.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
                      Excluir Conta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}