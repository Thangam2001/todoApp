import { useState, useEffect, FormEvent } from 'react';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Check, X, Square, CheckSquare, Search } from 'lucide-react';
import { Todo } from '../types';
import Loading from './ui/Loading';

interface DashboardProps {
  user: any;
}

export default function Dashboard({ user }: DashboardProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      setTodos(items);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'todos');
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'todos'), {
        title: newTodo.trim(),
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNewTodo('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'todos');
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      await updateDoc(doc(db, 'todos', todo.id), {
        completed: !todo.completed,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `todos/${todo.id}`);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `todos/${id}`);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <form onSubmit={handleAddTodo} className="flex gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 glass-input text-lg"
          />
          <button type="submit" className="btn-primary group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          </button>
        </form>
      </motion.div>

      <div className="flex items-center justify-between px-4">
         <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm font-medium px-4 py-1 rounded-full transition-all capitalize ${
                  filter === f ? 'bg-primary text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {f}
              </button>
            ))}
         </div>
         <p className="text-xs text-white/30 font-mono">
           {todos.filter(t => !t.completed).length} items left
         </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-4 flex items-center gap-4 group hover:bg-white/[0.07] transition-all"
            >
              <button 
                onClick={() => toggleTodo(todo)}
                className={`p-2 rounded-xl transition-all ${
                  todo.completed ? 'text-primary' : 'text-white/20 hover:text-white/40'
                }`}
              >
                {todo.completed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
              </button>
              
              <span className={`flex-1 text-lg transition-all ${todo.completed ? 'text-white/30 line-through' : ''}`}>
                {todo.title}
              </span>

              <button 
                onClick={() => deleteTodo(todo.id)}
                className="p-2 text-white/0 group-hover:text-accent/50 hover:text-accent transition-all rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTodos.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-white/20 italic"
          >
            No tasks found. Time to relax?
          </motion.div>
        )}
      </div>
    </div>
  );
}
