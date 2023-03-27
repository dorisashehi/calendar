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
        $dates = AvailabilityDates::where('user_id', Auth::id())->pluck('date');

        return $dates->toJson();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //

        $date = new AvailabilityDates();
        $date->user_id = $request->user()->id;
        $date->date = $request->date;
        $date->save();

        return response()->json(['status' => 'success']);
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
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        //delete date
        // print_r(
        //     AvailabilityDates::where('date', $request->date)->where(
        //         'user_id',
        //         $request->user()->id
        //     )
        // );

        AvailabilityDates::where('date', $request->date)
            ->where('user_id', $request->user()->id)
            ->delete();

        return response()->json(['status' => 'deleted']);
    }
}
