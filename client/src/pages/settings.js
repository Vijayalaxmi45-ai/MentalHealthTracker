"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
const react_1 = require("react");
const react_query_1 = require("@tanstack/react-query");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const label_1 = require("@/components/ui/label");
const avatar_1 = require("@/components/ui/avatar");
const badge_1 = require("@/components/ui/badge");
const lucide_react_1 = require("lucide-react");
const use_toast_1 = require("@/hooks/use-toast");
function Settings() {
    var _a, _b, _c;
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    const [audioBlob, setAudioBlob] = (0, react_1.useState)(null);
    const [imageFile, setImageFile] = (0, react_1.useState)(null);
    const fileInputRef = (0, react_1.useRef)(null);
    const mediaRecorderRef = (0, react_1.useRef)(null);
    const { toast } = (0, use_toast_1.useToast)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const { data: user } = (0, react_query_1.useQuery)({
        queryKey: ["/api/auth/user"],
    });
    const { data: userStats } = (0, react_query_1.useQuery)({
        queryKey: ["/api/user/stats"],
    });
    const { data: savedMusic } = (0, react_query_1.useQuery)({
        queryKey: ["/api/saved-music"],
    });
    // Voice recording functionality
    const startRecording = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const stream = yield navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
            setIsRecording(true);
            toast({
                title: "Recording started",
                description: "Speak your thoughts for voice journaling",
            });
        }
        catch (error) {
            toast({
                title: "Microphone access denied",
                description: "Please allow microphone access to use voice journaling",
                variant: "destructive",
            });
        }
    });
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            toast({
                title: "Recording stopped",
                description: "Your voice note has been saved",
            });
        }
    };
    // Image upload functionality
    const handleImageUpload = (event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    title: "File too large",
                    description: "Please select an image smaller than 5MB",
                    variant: "destructive",
                });
                return;
            }
            setImageFile(file);
            toast({
                title: "Image selected",
                description: "Click upload to save your profile picture",
            });
        }
    };
    const uploadProfilePicture = (0, react_query_1.useMutation)({
        mutationFn: (file) => __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('image', file);
            const response = yield fetch('/api/user/profile-picture', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok)
                throw new Error('Upload failed');
            return response.json();
        }),
        onSuccess: () => {
            toast({
                title: "Profile picture updated",
                description: "Your new profile picture has been saved",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
            setImageFile(null);
        },
        onError: () => {
            toast({
                title: "Upload failed",
                description: "Failed to upload profile picture",
                variant: "destructive",
            });
        },
    });
    const processVoiceNote = (0, react_query_1.useMutation)({
        mutationFn: (audioBlob) => __awaiter(this, void 0, void 0, function* () {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice-note.wav');
            const response = yield fetch('/api/voice/transcribe', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok)
                throw new Error('Transcription failed');
            return response.json();
        }),
        onSuccess: (data) => {
            toast({
                title: "Voice note processed",
                description: `Transcription: "${data.text.substring(0, 50)}..."`,
            });
            setAudioBlob(null);
        },
        onError: () => {
            toast({
                title: "Processing failed",
                description: "Voice note transcription is not available yet",
                variant: "destructive",
            });
        },
    });
    return (<div className="min-h-screen bg-[var(--mindtune-neutral-50)] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--mindtune-neutral-800)]">Account Settings</h1>
          <p className="text-[var(--mindtune-neutral-600)] mt-2">Manage your profile and preferences</p>
        </div>

        {/* Profile Section */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.User className="w-5 h-5"/>
              Profile Information
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <avatar_1.Avatar className="w-20 h-20">
                <avatar_1.AvatarImage src={(user === null || user === void 0 ? void 0 : user.profileImageUrl) || undefined}/>
                <avatar_1.AvatarFallback className="bg-[var(--mindtune-primary)] text-white text-xl">
                  {(_a = user === null || user === void 0 ? void 0 : user.firstName) === null || _a === void 0 ? void 0 : _a[0]}{(_b = user === null || user === void 0 ? void 0 : user.lastName) === null || _b === void 0 ? void 0 : _b[0]}
                </avatar_1.AvatarFallback>
              </avatar_1.Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user === null || user === void 0 ? void 0 : user.firstName} {user === null || user === void 0 ? void 0 : user.lastName}</h3>
                <p className="text-[var(--mindtune-neutral-600)] flex items-center gap-2">
                  <lucide_react_1.Mail className="w-4 h-4"/>
                  {user === null || user === void 0 ? void 0 : user.email}
                </p>
                <p className="text-sm text-[var(--mindtune-neutral-500)] flex items-center gap-2 mt-1">
                  <lucide_react_1.Calendar className="w-4 h-4"/>
                  Member since {new Date(user === null || user === void 0 ? void 0 : user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label_1.Label htmlFor="image-upload">Profile Picture</label_1.Label>
                <div className="flex items-center gap-4 mt-2">
                  <button_1.Button variant="outline" onClick={() => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} className="flex items-center gap-2">
                    <lucide_react_1.Camera className="w-4 h-4"/>
                    Choose Image
                  </button_1.Button>
                  {imageFile && (<button_1.Button onClick={() => uploadProfilePicture.mutate(imageFile)} disabled={uploadProfilePicture.isPending}>
                      <lucide_react_1.Upload className="w-4 h-4 mr-2"/>
                      {uploadProfilePicture.isPending ? "Uploading..." : "Upload"}
                    </button_1.Button>)}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                </div>
                {imageFile && (<p className="text-sm text-[var(--mindtune-neutral-600)] mt-2">
                    Selected: {imageFile.name}
                  </p>)}
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Voice Journaling Section */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Mic className="w-5 h-5"/>
              Voice Journaling
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent className="space-y-4">
            <p className="text-[var(--mindtune-neutral-600)]">
              Record voice notes to capture your thoughts and feelings
            </p>
            
            <div className="flex items-center gap-4">
              <button_1.Button onClick={isRecording ? stopRecording : startRecording} variant={isRecording ? "destructive" : "default"} className="flex items-center gap-2">
                <lucide_react_1.Mic className="w-4 h-4"/>
                {isRecording ? "Stop Recording" : "Start Recording"}
              </button_1.Button>
              
              {audioBlob && (<button_1.Button onClick={() => processVoiceNote.mutate(audioBlob)} disabled={processVoiceNote.isPending} variant="outline">
                  {processVoiceNote.isPending ? "Processing..." : "Process Voice Note"}
                </button_1.Button>)}
            </div>

            {isRecording && (<div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                Recording in progress...
              </div>)}

            {audioBlob && (<div className="p-3 bg-[var(--mindtune-neutral-100)] rounded-lg">
                <p className="text-sm">Voice note recorded. Click "Process Voice Note" to transcribe.</p>
              </div>)}
          </card_1.CardContent>
        </card_1.Card>

        {/* Statistics Section */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Your Progress</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-primary)]">
                  {(userStats === null || userStats === void 0 ? void 0 : userStats.totalEntries) || 0}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Mood Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-secondary)]">
                  {(userStats === null || userStats === void 0 ? void 0 : userStats.currentStreak) || 0}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-accent)]">
                  {(userStats === null || userStats === void 0 ? void 0 : userStats.weeklyActivities) || 0}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-primary)]">
                  {((_c = userStats === null || userStats === void 0 ? void 0 : userStats.averageMood) === null || _c === void 0 ? void 0 : _c.toFixed(1)) || "0.0"}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Avg Mood</div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Saved Music Section */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Music className="w-5 h-5"/>
              Saved Music
            </card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            {savedMusic && savedMusic.length > 0 ? (<div className="space-y-3">
                {savedMusic.slice(0, 5).map((saved) => (<div key={saved.id} className="flex items-center justify-between p-3 bg-[var(--mindtune-neutral-100)] rounded-lg">
                    <div>
                      <h4 className="font-medium">{saved.title}</h4>
                      <p className="text-sm text-[var(--mindtune-neutral-600)]">{saved.artist}</p>
                    </div>
                    <badge_1.Badge variant="secondary">{saved.mood}</badge_1.Badge>
                  </div>))}
              </div>) : (<p className="text-[var(--mindtune-neutral-600)]">No saved music yet. Start exploring music recommendations!</p>)}
          </card_1.CardContent>
        </card_1.Card>

        {/* Logout Section */}
        <card_1.Card>
          <card_1.CardContent className="pt-6">
            <button_1.Button variant="outline" onClick={() => window.location.href = "/api/logout"} className="w-full">
              Sign Out
            </button_1.Button>
          </card_1.CardContent>
        </card_1.Card>
      </div>
    </div>);
}
