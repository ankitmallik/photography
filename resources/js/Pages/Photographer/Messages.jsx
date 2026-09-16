import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PhotographerLayout from '@/Layouts/PhotographerLayout';
import { MessageSquare, Send, CalendarCheck } from 'lucide-react';

export default function PhotographerMessages({ conversations = [], selectedConversation = null }) {
    const [msgText, setMsgText] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!msgText.trim() || !selectedConversation) return;

        router.post('/photographer/messages/send', {
            conversation_id: selectedConversation.id,
            message_text: msgText,
        }, {
            preserveScroll: true,
            onSuccess: () => setMsgText(''),
        });
    };

    return (
        <PhotographerLayout title="Client Messages">
            
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-white">Client Messages</h1>
                <p className="text-xs text-slate-400 mt-0.5">Communicate directly with clients regarding requirements, timings, and quotes.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl h-[650px] grid grid-cols-1 md:grid-cols-3">
                
                {/* Left Col: Conversation List */}
                <div className="border-r border-slate-800 flex flex-col h-full bg-slate-900/60">
                    <div className="p-4 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-400">
                        Inquiries & Chats ({conversations.length})
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                        {conversations.length > 0 ? (
                            conversations.map((conv) => (
                                <Link
                                    key={conv.id}
                                    href={`/photographer/messages?conversation_id=${conv.id}`}
                                    className={`p-4 block transition hover:bg-slate-800/80 ${
                                        selectedConversation?.id === conv.id ? 'bg-emerald-500/10 border-l-4 border-emerald-500' : ''
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-sm shrink-0">
                                            {conv.customer?.avatar ? (
                                                <img src={conv.customer.avatar} alt="avatar" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                conv.customer?.name?.charAt(0) || 'C'
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-bold text-xs text-white truncate">{conv.customer?.name}</h4>
                                                <span className="text-[10px] text-slate-500">{new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            {conv.booking && (
                                                <span className="text-[10px] text-emerald-400 font-medium block">
                                                    Order #{conv.booking.booking_number}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-8 text-center text-xs text-slate-400">
                                No client inquiries yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right 2 Cols: Chat Window */}
                <div className="md:col-span-2 flex flex-col h-full bg-slate-950/60">
                    {selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                                        {selectedConversation.customer?.name?.charAt(0) || 'C'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white">{selectedConversation.customer?.name}</h3>
                                        <p className="text-[10.5px] text-slate-400">{selectedConversation.customer?.phone || selectedConversation.customer?.email}</p>
                                    </div>
                                </div>

                                {selectedConversation.booking && (
                                    <Link 
                                        href={`/photographer/bookings/${selectedConversation.booking.id}`}
                                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
                                    >
                                        <CalendarCheck size={13} className="text-emerald-400" />
                                        <span>Order #{selectedConversation.booking.booking_number}</span>
                                    </Link>
                                )}
                            </div>

                            {/* Message Thread */}
                            <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                                {selectedConversation.messages?.map((msg) => {
                                    const isMe = msg.sender_id === auth?.user?.id;
                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                                isMe 
                                                    ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-xs shadow-md shadow-emerald-500/10' 
                                                    : 'bg-slate-800 text-slate-200 rounded-tl-xs border border-slate-700/80'
                                            }`}>
                                                {msg.message_text}
                                            </div>
                                            <span className="text-[10px] text-slate-500 mt-1 px-1">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-900/90 flex gap-2">
                                <input 
                                    type="text"
                                    placeholder="Type your reply to the client..."
                                    value={msgText}
                                    onChange={(e) => setMsgText(e.target.value)}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                                />
                                <button 
                                    type="submit"
                                    disabled={!msgText.trim()}
                                    className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                                >
                                    <span>Send</span>
                                    <Send size={13} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <MessageSquare className="w-12 h-12 text-slate-600 mb-2" />
                            <h3 className="font-bold text-sm text-white">No Client Chat Selected</h3>
                            <p className="text-xs max-w-xs mt-1">Select an inquiry from the left to start communicating with the client.</p>
                        </div>
                    )}
                </div>
            </div>

        </PhotographerLayout>
    );
}
