<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AvailabilityDates;
use Illuminate\Support\Facades\Auth;

class Availability extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $dates = AvailabilityDates::where('user_id', Auth::id())
            ->get('date')
            ->toArray();
        return response()->json($dates);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Check if really the date clicked is at db or not
     */
    public function checkAvailability($userId, $date)
    {
        $availability = AvailabilityDates::where('user_id', $userId)
            ->where('date', $date)
            ->first();

        if ($availability) {
            return $availability->available;
        } else {
            return null;
        }
    }
    /**
     * Store the date clicked into db.
     */
    public function store(Request $request)
    {
        //
        $availble_or_not = $this->checkAvailability(
            $request->user()->id,
            $request->date
        );

        //then save into db
        if ($availble_or_not == null) {
            $date = new AvailabilityDates();
            $date->user_id = $request->user()->id;
            $date->date = $request->date;
            $date->save();
            return response()->json(['status' => 'success']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove date clicked from db.
     */
    public function destroy(Request $request)
    {
        $availble_or_not = $this->checkAvailability(
            $request->user()->id,
            $request->date
        );

        //then delete from db
        if ($availble_or_not == 1) {
            AvailabilityDates::where('date', $request->date)
                ->where('user_id', $request->user()->id)
                ->delete();
            return response()->json(['status' => 'deleted']);
        }
    }
}
