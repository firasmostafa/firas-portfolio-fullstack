<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Mail\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MessageController extends Controller
{
    /**
     * Display all messages.
     */
    public function index()
    {
        $messages = Message::latest()->get();

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Store a new message and send email notification.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'enquiry' => 'required|string|max:255',
            'message' => 'required|string|min:25',
        ]);

        // Save message in MySQL
        $message = Message::create($validated);

        // Send a copy to your email
        Mail::to('frasm688@gmail.com')
            ->send(new ContactMessage($validated));

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully.',
            'data' => $message,
        ], 201);
    }

    /**
     * Display one message.
     */
    public function show(Message $message)
    {
        return response()->json([
            'success' => true,
            'data' => $message,
        ]);
    }

    /**
     * Delete a message.
     */
    public function destroy(Message $message)
    {
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully.',
        ]);
    }
}
