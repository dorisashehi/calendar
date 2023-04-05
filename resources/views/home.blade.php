@extends('layouts.app')

@section('content')
<script>
    window.user_id={{auth()->user()->id}};
        
</script>
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Dashboard') }}</div>

                <div class="card-body" id="card-body" data-user-id = {{auth()->user()->id}}>
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    {{ __('You are logged in!') }}

                    <div class="actions">
                        <a href="#" id="availability" class= "no" data-value = "false">I'm available none of the time</a> | 
                        <a href="#" id="availability" class = "yes" data-value = "true">I'm available all the time</a>
                    </div>
                    <div id="calendar"></div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
