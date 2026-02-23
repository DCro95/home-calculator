import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/scenarios — List all user's saved scenarios
export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('scenarios')
    .select('id, name, data, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scenarios: data })
}

// POST /api/scenarios — Save a new scenario
export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, data: scenarioData } = body

  if (!scenarioData) {
    return NextResponse.json({ error: 'Missing scenario data' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('scenarios')
    .insert({
      user_id: user.id,
      name: name || 'Untitled Scenario',
      data: scenarioData,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scenario: data }, { status: 201 })
}

// PUT /api/scenarios — Update an existing scenario
export async function PUT(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, name, data: scenarioData } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing scenario ID' }, { status: 400 })
  }

  const updateFields: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (name) updateFields.name = name
  if (scenarioData) updateFields.data = scenarioData

  const { data, error } = await supabase
    .from('scenarios')
    .update(updateFields)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure user owns this scenario
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ scenario: data })
}

// DELETE /api/scenarios — Delete a scenario
export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing scenario ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('scenarios')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
