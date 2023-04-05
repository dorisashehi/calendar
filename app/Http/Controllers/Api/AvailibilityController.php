<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\AvailabilityDates;
use App\Http\Controllers\Controller;

class AvailibilityController extends Controller
{
    //
    public function index(Request $request)
    {
        //params: user_id
        //http://calendar.test/api/availability?user_id=1
        $dates = AvailabilityDates::where('user_id', $request->user_id)
            ->get('date')
            ->toArray();
        return response()->json($dates);
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
        //http://calendar.test/api/availability/date?user_id=1&date=2023-02-28
        //params: user_id and date
        //
        $availble_or_not = $this->checkAvailability(
            $request->user_id,
            $request->date
        );

        //then save into db
        if ($availble_or_not == null) {
            $date = new AvailabilityDates();
            $date->user_id = $request->user_id;
            $date->date = $request->date;
            $date->save();
            return response()->json(['status' => 'success']);
        } else {
            return response()->json(['status' => 'already exists that date.']);
        }
    }

    /**
     * Remove date clicked from db.
     */
    public function destroy(Request $request)
    {
        //http://calendar.test/api/availability/delete/date?user_id=1&date=2023-02-28
        //params: user_id and date

        $availble_or_not = $this->checkAvailability(
            $request->user_id,
            $request->date
        );

        //then delete from db
        if ($availble_or_not == 1) {
            AvailabilityDates::where('date', $request->date)
                ->where('user_id', $request->user_id)
                ->delete();
            return response()->json(['status' => 'deleted']);
        } else {
            return response()->json([
                'status' => 'Doesnt exist that date into db',
            ]);
        }
    }
}
