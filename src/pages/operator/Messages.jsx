import { useState } from 'react'
import { MdSend, MdSearch } from 'react-icons/md'
import { motion } from 'framer-motion'
import OperatorLayout from './OperatorLayout'

const conversations = [
  { id: 1, name: 'Officer Ramesh Kumar', role: 'Field Officer', lastMsg: 'I have completed the inspection...', time: '10 mins ago', unread: 2, avatar: '👨‍💼' },
  { id: 2, name: 'Officer Priya Sharma', role: 'Field Officer', lastMsg: 'Need clarification on complaint #9234', time: '1 hour ago', unread: 0, avatar: '👩‍💼' },
  { id: 3, name: 'Taluk Office - North', role: 'Department', lastMsg: 'Escalated case has been reviewed', time: '3 hours ago', unread: 1, avatar: '🏢' },
  { id: 4, name: 'Officer Anil Reddy', role: 'Field Officer', lastMsg: 'Photo evidence uploaded', time: 'Yesterday', unread: 0, avatar: '👨‍💼' },
]

const messages = [
  { id: 1, sender: 'Officer Ramesh Kumar', text: 'Hello, I need the details for complaint #IGMS-2024-9234', time: '10:30 AM', isMe: false },
  { id: 2, sender: 'Me', text: 'Sure, I will send you the complete file with citizen details and location map.', time: '10:32 AM', isMe: true },
  { id: 3, sender: 'Officer Ramesh Kumar', text: 'I have completed the inspection and uploaded the photos. Please review.', time: '11:15 AM', isMe: false },
  { id: 4, sender: 'Me', text: 'Great work! I have reviewed the photos. You can proceed with the resolution.', time: '11:20 AM', isMe: true },
]

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [search, setSearch] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      alert(`Message sent: ${newMessage}`)
      setNewMessage('')
    }
  }

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <OperatorLayout active="messages">
      
      <div style={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #ede5d8', overflow: 'hidden', height: 'calc(100vh - 200px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: '100%' }}>
          
          {/* Left Sidebar - Conversations */}
          <div style={{ borderRight: '1px solid #ede5d8', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #ede5d8' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 16px' }}>
                Messages
              </h2>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 14px', borderRadius: '10px',
                backgroundColor: '#faf6f0', border: '1.5px solid #e0d5c8',
              }}>
                <MdSearch size={18} color="#9e8e80" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent',
                  }}
                />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedChat(conv)}
                  style={{
                    padding: '16px 20px', borderBottom: '1px solid #ede5d8',
                    cursor: 'pointer',
                    backgroundColor: selectedChat.id === conv.id ? '#faf6f0' : 'transparent',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      backgroundColor: '#edf7f1', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '20px', flexShrink: 0,
                    }}>
                      {conv.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: '#1a1a1a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {conv.name}
                        </p>
                        {conv.unread > 0 && (
                          <span style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            backgroundColor: '#41A465', color: '#fff',
                            fontSize: '11px', fontWeight: '700',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {conv.unread}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#9e8e80', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.lastMsg}
                      </p>
                      <p style={{ fontSize: '11px', color: '#9e8e80', margin: 0 }}>
                        {conv.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Chat Area */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Chat Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #ede5d8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  backgroundColor: '#edf7f1', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                }}>
                  {selectedChat.avatar}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', margin: '0 0 2px' }}>
                    {selectedChat.name}
                  </p>
                  <p style={{ fontSize: '13px', color: '#9e8e80', margin: 0 }}>
                    {selectedChat.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    justifyContent: msg.isMe ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: msg.isMe ? '#41A465' : '#faf6f0',
                    color: msg.isMe ? '#fff' : '#1a1a1a',
                  }}>
                    {!msg.isMe && (
                      <p style={{ fontSize: '12px', fontWeight: '600', margin: '0 0 4px', opacity: 0.8 }}>
                        {msg.sender}
                      </p>
                    )}
                    <p style={{ fontSize: '14px', margin: '0 0 6px', lineHeight: 1.5 }}>
                      {msg.text}
                    </p>
                    <p style={{ fontSize: '11px', margin: 0, opacity: 0.7, textAlign: 'right' }}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid #ede5d8' }}>
              <div style={{
                display: 'flex', gap: '12px', alignItems: 'center',
                padding: '12px 16px', borderRadius: '12px',
                backgroundColor: '#faf6f0', border: '1.5px solid #e0d5c8',
              }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    fontSize: '14px', color: '#1a1a1a', backgroundColor: 'transparent',
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    backgroundColor: '#41A465', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <MdSend size={18} color="#fff" />
                </motion.button>
              </div>
            </form>
          </div>

        </div>
      </div>

    </OperatorLayout>
  )
}
