import { useState } from 'react'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { Guard } from './components/Guard'
import { Todo, User } from './auth/types'
import './index.css'

// --- MOCK DATA ---
const MOCK_ADMIN_ROLE = {
  name: "Admin",
  permissions: [
    { resource: "todos", action: "delete", policy: "ALWAYS_ALLOW" },
    { resource: "todos", action: "view", policy: "ALWAYS_ALLOW" }
  ]
};

const MOCK_USER_ROLE = {
  name: "User",
  permissions: [
    { resource: "todos", action: "delete", policy: "DELETE_OWN_COMPLETED" },
    { resource: "todos", action: "view", policy: "IS_OWNER" }
  ]
};

const USER_ALICE: User = {
  id: "u1",
  email: "alice@example.com",
  roles: [MOCK_USER_ROLE]
};

const USER_ADMIN: User = {
  id: "admin1",
  email: "admin@example.com",
  roles: [MOCK_ADMIN_ROLE]
};

const TODO_ITEM: Todo = {
  id: "t1",
  title: "Finish the report",
  userId: "u1", // Alice owns this
  invitedUsers: [],
  completed: true
};

function DemoContent() {
  const { user, login, logout } = useAuth();
  const [todo, setTodo] = useState<Todo>(TODO_ITEM);

  if (!user) {
    return (
      <div className="card">
        <h2>Please Login</h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => login(USER_ALICE)}>Login as Alice (User)</button>
          <button onClick={() => login(USER_ADMIN)}>Login as Bob (Admin)</button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Welcome, {user.email}</h2>
      <button onClick={logout}>Logout</button>

      <div style={{ marginTop: '2rem', border: '1px solid #444', padding: '1rem', borderRadius: '8px' }}>
        <h3>Todo Item: {todo.title}</h3>
        <p>Owner ID: {todo.userId}</p>
        <p>Status: {todo.completed ? "Completed" : "Pending"}</p>

        <div style={{ marginTop: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={e => setTodo({ ...todo, completed: e.target.checked })}
            />
            Toggle Completed Status (to test permission)
          </label>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {/* GUARDED BUTTON */}
          <Guard
            action="delete"
            resource="todos"
            data={todo}
            fallback={<span style={{ color: 'gray', fontStyle: 'italic' }}>You cannot delete this task</span>}
          >
            <button style={{ backgroundColor: '#aa2222' }}>Delete Task</button>
          </Guard>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#888' }}>
        <p>Permission Rule: <strong>DELETE_OWN_COMPLETED</strong> (Must be owner AND completed)</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <h1>RBAC/ABAC Demo</h1>
        <DemoContent />
      </div>
    </AuthProvider>
  )
}

export default App
