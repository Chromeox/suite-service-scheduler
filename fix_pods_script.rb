#!/usr/bin/env ruby

require 'xcodeproj'

project_path = 'ios/App/App.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main target
target = project.targets.find { |t| t.name == 'App' }

if target
  # Find the "[CP] Embed Pods Frameworks" build phase
  embed_pods_phase = target.shell_script_build_phases.find { |phase| phase.name == '[CP] Embed Pods Frameworks' }
  
  if embed_pods_phase
    # Set the "Based on dependency analysis" to false
    embed_pods_phase.always_out_of_date = 1
    puts "Fixed '[CP] Embed Pods Frameworks' build phase"
  else
    puts "Could not find '[CP] Embed Pods Frameworks' build phase"
  end
  
  # Save the project
  project.save
  puts "Project saved successfully"
else
  puts "Could not find 'App' target"
end
