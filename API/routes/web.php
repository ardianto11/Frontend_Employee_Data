<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->get('employees',  ['uses' => 'EmployeeController@showAllEmployees']);
  
    $router->get('employees/{id}', ['uses' => 'EmployeeController@showOneEmployee']);
  
    $router->post('employees/create', ['uses' => 'EmployeeController@create']);
   
    $router->delete('employees/delete/{id}', ['uses' => 'EmployeeController@delete']);
  
    $router->put('employees/{id}', ['uses' => 'EmployeeController@update']);
  });

//   php -S 192.168.1.127:8000 -t public