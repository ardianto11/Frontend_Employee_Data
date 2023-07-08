<?php

namespace App\Http\Controllers;

use App\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\Validate;

class EmployeeController extends Controller
{
    
    public function showAllEmployees()
    {
        return response()->json(Employee::all());
    }

    public function showOneEmployee($id)
    {
        return response()->json(Employee::find($id));
    }

    public function create(Request $request)
    {
        // $employee = Employee::create($request->all());

        $this->validate($request, [
            'name' => 'required',
            'address' => 'required',
            'nip' => 'required',
            'photo' => 'file'
        ]);

        if ($request->file('photo')) {
            $foto = time().$request->file('photo')->getClientOriginalName();
            $request->file('photo')->move('upload', $foto);
            
            $name = $request->name;
            $address = $request->address;
            $nip = $request->nip;
            $photo = url('upload'.'/'.$foto);
        } else {
            $name = $request->name;
            $address = $request->address;
            $nip = $request->nip;
            $photo = 'Default.png';
        }

        $employee = Employee::create([
            'name' => $name,
            'address' => $address,
            'nip' => $nip,
            'photo' => $photo
        ]);
        
        return response()->json($employee, 201);
    }

    public function update($id, Request $request)
    {
        $employee = Employee::findOrFail($id);
        $employee->update($request->all());

        return response()->json($employee, 200);
    }

    public function delete($id)
    {
        Employee::findOrFail($id)->delete();
        return response('Deleted Successfully', 200);
    }
}