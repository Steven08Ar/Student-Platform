import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CollaborativeEditor } from '@/components/virtualClassroom/CollaborativeEditor';
import { OutputPanel } from '@/components/virtualClassroom/OutputPanel';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    MessageSquare,
    Users,
    LogOut,
    Settings,
    Lock,
    Unlock,
    Play,
    Loader2
} from 'lucide-react';

/**
 * VirtualClassroom - Main layout for collaborative coding sessions
 * 
 * Layout Structure:
 * ┌─────────────────────────────────────────────────┐
 * │  Top Bar (Session Info + Participants)          │
 * ├──────────┬──────────────────────┬───────────────┤
 * │  Chat    │   Code Editor        │  Participants │
 * │  Panel   │   (Monaco + Yjs)     │  List         │
 * │          │                      │               │
 * ├──────────┴──────────────────────┴───────────────┤
 * │  Bottom Controls (Mic, Camera, Leave)           │
 * └─────────────────────────────────────────────────┘
 */
export const VirtualClassroom = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { userData } = useAuth();

    // UI State
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isParticipantsOpen, setIsParticipantsOpen] = useState(true);
    const [isEditorLocked, setIsEditorLocked] = useState(false);

    // Code execution
    const { output, error, isExecuting, executionTime, executeCode, clearOutput } = useCodeExecution();
    const [currentCode, setCurrentCode] = useState('');

    // Coming soon modal
    const [showComingSoonModal, setShowComingSoonModal] = useState(false);
    const [comingSoonFeature, setComingSoonFeature] = useState('');

    // Mock participants (will be replaced with real-time data)
    const [participants, setParticipants] = useState([
        { id: userData?.uid, name: userData?.name, role: userData?.role, color: '#1A4D3E' }
    ]);

    // Session info (will be fetched from Firestore)
    const [session, setSession] = useState({
        title: 'Python Basics - Live Coding Session',
        startedAt: new Date(),
        language: 'python'
    });

    const handleLeaveSession = () => {
        if (confirm('Are you sure you want to leave this session?')) {
            navigate('/dashboard');
        }
    };

    const handleRunCode = async () => {
        if (!currentCode.trim()) {
            return;
        }
        await executeCode(currentCode, sessionId);
    };

    const handleComingSoon = (feature) => {
        setComingSoonFeature(feature);
        setShowComingSoonModal(true);
    };

    const isTeacher = userData?.role === 'teacher';

    return (
        <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-white font-bold text-lg">{session.title}</h1>
                        <p className="text-gray-400 text-xs">
                            Started {session.startedAt.toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                {/* Participant Thumbnails */}
                <div className="flex items-center gap-2">
                    {participants.slice(0, 5).map((participant) => (
                        <div
                            key={participant.id}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: participant.color }}
                            title={participant.name}
                        >
                            {participant.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {participants.length > 5 && (
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs">
                            +{participants.length - 5}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel - Chat */}
                {isChatOpen && (
                    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Chat
                            </h3>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            <p className="text-gray-500 text-sm text-center">
                                Chat functionality coming soon...
                            </p>
                        </div>
                        <div className="p-4 border-t border-gray-700">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A4D3E]"
                                disabled
                            />
                        </div>
                    </div>
                )}

                {/* Center Panel - Code Editor */}
                <div className="flex-1 flex flex-col">
                    {/* Editor Toolbar with Run Button */}
                    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">Language: Python 3.9</span>
                            {isTeacher && (
                                <button
                                    onClick={handleRunCode}
                                    disabled={isExecuting || !currentCode.trim()}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    {isExecuting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Running...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-4 w-4" />
                                            Run Code
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                        {isTeacher && (
                            <button
                                onClick={() => setIsEditorLocked(!isEditorLocked)}
                                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${isEditorLocked
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {isEditorLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                {isEditorLocked ? 'Locked' : 'Unlocked'}
                            </button>
                        )}
                    </div>

                    {/* Editor + Output Split View */}
                    <div className="flex-1 flex flex-col">
                        {/* Code Editor - 60% height */}
                        <div className="flex-[3]">
                            <CollaborativeEditor
                                sessionId={sessionId}
                                userId={userData?.uid}
                                userName={userData?.name}
                                userColor={userData?.role === 'teacher' ? '#1A4D3E' : '#3B82F6'}
                                readOnly={!isTeacher && isEditorLocked}
                                onCodeChange={setCurrentCode}
                            />
                        </div>

                        {/* Output Panel - 40% height */}
                        <div className="flex-[2] border-t border-gray-700">
                            <OutputPanel
                                output={output}
                                error={error}
                                executionTime={executionTime}
                                onClear={clearOutput}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Participants */}
                {isParticipantsOpen && (
                    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Participants ({participants.length})
                            </h3>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-2">
                            {participants.map((participant) => (
                                <div
                                    key={participant.id}
                                    className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                        style={{ backgroundColor: participant.color }}
                                    >
                                        {participant.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white text-sm font-medium">
                                            {participant.name}
                                            {participant.id === userData?.uid && ' (You)'}
                                        </div>
                                        <div className="text-gray-400 text-xs capitalize">
                                            {participant.role}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            <div className="bg-gray-800 border-t border-gray-700 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className={`p-2 rounded-lg transition-colors ${isChatOpen ? 'bg-[#1A4D3E] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        title="Toggle Chat"
                    >
                        <MessageSquare className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setIsParticipantsOpen(!isParticipantsOpen)}
                        className={`p-2 rounded-lg transition-colors ${isParticipantsOpen ? 'bg-[#1A4D3E] text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        title="Toggle Participants"
                    >
                        <Users className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    {/* Video and Audio controls - Coming Soon */}
                    <button
                        onClick={() => handleComingSoon('Micrófono')}
                        className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Micrófono"
                    >
                        <MicOff className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => handleComingSoon('Cámara')}
                        className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        title="Cámara"
                    >
                        <VideoOff className="h-5 w-5" />
                    </button>

                    {/* Leave Session */}
                    <button
                        onClick={handleLeaveSession}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-2 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Leave
                    </button>
                </div>
            </div>

            {/* Coming Soon Modal */}
            {showComingSoonModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-3">
                            {comingSoonFeature}
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Esta funcionalidad estará disponible próximamente.
                        </p>
                        <button
                            onClick={() => setShowComingSoonModal(false)}
                            className="w-full bg-[#1A4D3E] hover:bg-[#143D31] text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
